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

        stage('Cleanup Existing Containers') {
            steps {
                script {
                    // Force remove any existing containers and networks
                    sh '''
                        # Stop and remove any existing containers from previous runs
                        docker compose down --remove-orphans || true
                        
                        # Remove any dangling containers
                        docker ps -aq --filter name=mongo --filter name=backend --filter name=frontend | xargs -r docker rm -f || true
                        
                        # Remove any unused networks
                        docker network prune -f
                    '''
                }
            }
        }

        stage('Build and Start Services') {
            steps {
                script {
                    try {
                        // Start services in detached mode
                        sh 'docker compose up -d --build --remove-orphans'
                        
                        // Wait for services to be ready
                        sh '''
                            echo "Waiting for services to be ready..."
                            # Wait for MongoDB
                            timeout 60 bash -c '
                                while ! docker exec $(docker ps -q -f name=mongo) mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
                                    echo "Waiting for MongoDB..."
                                    sleep 5
                                done
                            ' || (echo "MongoDB did not start in time"; exit 1)
                            
                            # Wait for backend
                            timeout 60 bash -c '
                                while ! curl -s -f http://localhost:5001/health >/dev/null 2>&1; do
                                    echo "Waiting for backend..."
                                    sleep 5
                                done
                            ' || (echo "Backend did not start in time"; exit 1)
                        '''
                    } catch (Exception e) {
                        // If anything fails, clean up and rethrow the error
                        sh 'docker compose down --remove-orphans || true'
                        error("Failed to start services: ${e.message}")
                    }
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
                // Always try to clean up, even if the pipeline fails
                sh 'docker compose down --remove-orphans || true'
                sh 'docker system prune -af || true'  // Clean up any unused containers, networks, and images
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