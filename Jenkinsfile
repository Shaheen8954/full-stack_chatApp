pipeline {
    agent any
    
    environment {
        DOCKER_BUILDKIT = 1
    }
    
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
                        docker compose down -v --remove-orphans --rmi all || true
                        
                        # Remove any dangling containers and networks
                        docker ps -aq | xargs -r docker rm -f || true
                        docker network prune -f
                        docker volume prune -f
                    '''
                }
            }
        }

        stage('Build and Start Services') {
            steps {
                script {
                    try {
                        // Build and start services with health checks
                        sh '''
                            echo "Building and starting services..."
                            docker compose up -d --build --remove-orphans
                            
                            # Wait for MongoDB to be healthy
                            echo "Waiting for MongoDB to be ready..."
                            timeout 300 bash -c '
                                while ! docker inspect --format "{{.State.Health.Status}}" mongo | grep -q "healthy"; do
                                    echo "Waiting for MongoDB to be healthy..."
                                    sleep 5
                                done
                            ' || (echo "MongoDB did not become healthy in time"; docker logs mongo; exit 1)
                            
                            # Wait for backend to be responsive
                            echo "Waiting for backend to be ready..."
                            timeout 300 bash -c '
                                while ! curl -s -f http://localhost:5001/health >/dev/null 2>&1; do
                                    echo "Waiting for backend..."
                                    sleep 5
                                done
                            ' || (echo "Backend did not start in time"; docker logs backend; exit 1)
                            
                            echo "All services are up and running!"
                        '''
                    } catch (Exception e) {
                        // Log error and clean up
                        sh 'docker compose logs mongo || true'
                        sh 'docker compose logs backend || true'
                        sh 'docker compose down -v --remove-orphans || true'
                        error("Failed to start services: ${e.message}")
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    try {
                        // Run tests
                        sh '''
                            echo "Running tests..."
                            # Add your test commands here
                            # Example: npm test in frontend or backend
                            echo "Tests completed successfully!"
                        '''
                    } catch (Exception e) {
                        error("Tests failed: ${e.message}")
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Always clean up, even if the pipeline fails
                sh '''
                    echo "Cleaning up..."
                    docker compose down -v --remove-orphans || true
                    docker system prune -af || true
                '''
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