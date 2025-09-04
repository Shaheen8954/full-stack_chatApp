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

        stage('Build and Start Services') {
            steps {
                script {
                    // Start services in detached mode
                    sh 'docker compose up -d --build'
                    
                    // Wait for services to be ready
                    sh '''
                        echo "Waiting for services to be ready..."
                        # Wait for MongoDB
                        timeout 60 sh -c 'until docker exec $(docker ps -q -f name=mongo) mongosh --eval "db.adminCommand('ping')"'; do
                            echo "Waiting for MongoDB..."
                            sleep 5
                        done'
                        
                        # Wait for backend
                        timeout 60 sh -c 'until curl -s -f http://localhost:5001/health >/dev/null 2>&1; do
                            echo "Waiting for backend..."
                            sleep 5
                        done'
                    '''
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    sh '''
                        echo "Running tests..."
                        # Test backend health
                        curl -f http://localhost:5001/health
                        
                        # Test frontend (if needed)
                        # curl -f http://localhost:8081/ || exit 1
                    '''
                }
            }
        }
    }

    post {
        always {
            script {
                // Stop and remove containers
                sh 'docker compose down'
            }
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs for details.'
        }
    }
}