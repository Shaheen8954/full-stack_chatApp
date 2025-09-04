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
    }

        stage('Deploy') {
                    steps {
                        script {
                           sh 'docker compose up -d'
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
}