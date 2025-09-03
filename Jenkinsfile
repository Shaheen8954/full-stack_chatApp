pipeline {
    agent any

    stages {
        stage('CleanWorkspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout') {
            steps {
                git branch: 'DevOps',
                    url: 'https://github.com/Shaheen8954/full-stack_chatApp.git
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