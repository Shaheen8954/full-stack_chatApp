@Library('Shared@main') _

pipeline {
    agent any
    
    environment {
        DockerHubUser = 'shaheen8954'
        ProjectName = 'chatapp'
        ImageTag = "${BUILD_NUMBER}"
        Migration_Image_Name = 'chatapp-backend'
        Url = ('https://github.com/Shaheen8954/full-stack_chatApp.git')
        Branch = "DevOps"
        PortNumber = '8081:80'
        TRIVY_VERSION = '0.50.0'
    }

    stages {
        stage('Cleanup Workspace') {
            steps {
                script {
                    cleanWs()
                }
            }
        }
        
        stage('Clone Repository') {
            steps {
                script {
                    clone(env.Url, env.Branch)
                }
            }
        }
        
        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') {
                        dockerbuild(env.DockerHubUser, env.Migration_Image_Name, env.ImageTag)
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        dockerbuild(env.DockerHubUser, env.ProjectName, env.ImageTag)
                    }
                }
            }
        }
        
        stage('File System Security Scan') {
            steps {
                script {
                    // Install and run Gitleaks for secrets detection
                    sh '''
                        wget -q -O gitleaks.tgz https://github.com/gitleaks/gitleaks/releases/download/v8.18.1/gitleaks_8.18.1_linux_x64.tar.gz
                        tar xf gitleaks.tgz gitleaks
                        chmod +x gitleaks
                        ./gitleaks detect --source . --report-format sarif --report-path gitleaks-report.json
                        rm -f gitleaks.tgz gitleaks
                    '''
                    // Fail the build if any high or critical issues are found
                    // You can adjust the threshold based on your requirements
                    sh '''
                        if [ -s gitleaks-report.json ]; then
                            echo "Security vulnerabilities found in the codebase!"
                            cat gitleaks-report.json
                            exit 1
                        fi
                    '''
                }
            }
        }
        
        stage('Trivy Security Scan') {
            steps {
                script {
                    // Install Trivy if not already installed
                    sh '''
                        if ! command -v trivy &> /dev/null; then
                            wget https://github.com/aquasecurity/trivy/releases/download/v${TRIVY_VERSION}/trivy_${TRIVY_VERSION}_Linux-64bit.deb
                            sudo dpkg -i trivy_${TRIVY_VERSION}_Linux-64bit.deb
                            rm trivy_${TRIVY_VERSION}_Linux-64bit.deb
                        fi
                        
                        # Scan backend image
                        trivy image --exit-code 1 --severity CRITICAL ${DockerHubUser}/${Migration_Image_Name}:${ImageTag}
                        
                        # Scan frontend image
                        trivy image --exit-code 1 --severity CRITICAL ${DockerHubUser}/${ProjectName}:${ImageTag}
                    '''
                }
            }
        }
        
        stage('Push Docker Images') {
            parallel {
                stage('Push Backend Image') {
                    steps {
                        script {
                            dockerpush(env.DockerHubUser, env.Migration_Image_Name, env.ImageTag)
                        }
                    }
                }
                stage('Push Frontend Image') {
                    steps {
                        script {
                            dockerpush(env.DockerHubUser, env.ProjectName, env.ImageTag)
                        }
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sh 'docker compose up -d'
                }
            }
        }
    }
    
    post { 
        success { 
            echo 'Deployment completed successfully!'
        } 
        failure { 
            echo 'Deployment failed. Please check the logs for more details.'
        }
    }  
}