pipeline {
    agent any
    
    tools {
        // Make sure 'Default' is configured in Jenkins -> Manage Jenkins -> Global Tool Configuration
        git 'Default' 
    }

    stages {
        stage('CleanWorkspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout SCM') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/DevOps']],
                        extensions: [[$class: 'LocalBranch']],
                        userRemoteConfigs: [[
                            url: 'https://github.com/Shaheen8954/full-stack_chatApp.git',
                        ]]
                    ])
                    // Verify the branch was checked out
                    sh 'git branch -v'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh '''
                        sleep 15
                        curl -f http://localhost:5001/health
                        curl -f http://localhost/ || exit 1
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    sh 'docker-compose up -d --build'
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment and tests completed successfully!'
        }
        failure {
            echo 'Deployment or tests failed.'
        }
    }
}