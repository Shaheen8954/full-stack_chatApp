pipeline {
    agent any
    
    environment {
        DOCKERHUB_USER = credentials('dockerhub-username')   // store in Jenkins credentials
        DOCKERHUB_PASS = credentials('dockerhub-password')
        IMAGE_NAME = "shaheen8954/chatapp"   // your DockerHub repo
        IMAGE_TAG = "latest"
    }
    
    stages {
        // 1️⃣ Clean workspace and stop old containers
        stage('Clean Workspace') {
            steps {
                cleanWs()
                sh '''
                    docker compose down || true
                    docker system prune -f || true
                '''
            }
        }

        // 2️⃣ Clone GitHub repo
        stage('Checkout Code') {
            steps {
                git branch: 'DevOps', url: 'https://github.com/Shaheen8954/full-stack_chatApp.git'
            }
        }

        // 3️⃣ Filesystem Security Scan (Trivy)
        stage('Filesystem Security Scan') {
            steps {
                sh '''
                    mkdir -p trivy-results/filesystem
                    trivy fs . --severity HIGH,CRITICAL --format table --output trivy-results/filesystem/fs-scan.txt || true
                '''
                archiveArtifacts artifacts: 'trivy-results/filesystem/*', allowEmptyArchive: true
            }
        }

        // 4️⃣ Build & Push Docker image
        stage('Build & Push Docker Image') {
            steps {
                script {
                    sh '''
                        echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker build -t $IMAGE_NAME:$IMAGE_TAG .
                        docker push $IMAGE_NAME:$IMAGE_TAG
                    '''
                }
            }
        }

        // 5️⃣ Trivy Scan for Image
        stage('Trivy Image Scan') {
            steps {
                sh '''
                    mkdir -p trivy-results/images
                    trivy image $IMAGE_NAME:$IMAGE_TAG --severity HIGH,CRITICAL --format table --output trivy-results/images/image-scan.txt || true
                '''
                archiveArtifacts artifacts: 'trivy-results/images/*', allowEmptyArchive: true
            }
        }

        // 6️⃣ Deploy with Docker Compose
        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                    docker compose up -d --build
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Build and Deploy successful!'
        }
        failure {
            echo '❌ Build failed. Check logs.'
        }
    }
}
