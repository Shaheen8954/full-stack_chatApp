pipeline {
    agent any
    
    stages {
        // Clean the workspace to ensure a fresh start
        stage('Clean Up') {
            steps {
                cleanWs()
                sh '''
                    # Stop and remove any running containers
                    docker-compose down || true
                    
                    # Clean up unused Docker resources
                    docker system prune -f
                '''
            }
        }

        // Get the latest code from GitHub
        stage('Get Code') {
            steps {
                git branch: 'DevOps', 
                url: 'https://github.com/Shaheen8954/full-stack_chatApp.git'
            }
        }

        // Build and start the application
        stage('Build & Run') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }

        // Run tests (add your test commands here)
        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
                // Example test commands:
                // sh 'cd frontend && npm test'
                // sh 'cd backend && npm test'
            }
        }
    }
    
    // Clean up after the build
    post {
        success {
            echo 'Build successful! 🎉'
        }
        failure {
            echo 'Build failed. Check the logs for details.'
        }
    }
}