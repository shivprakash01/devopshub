pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USER        = 'shivayadav70'
        SERVER_IMAGE          = "${DOCKERHUB_USER}/devopshub-server"
        CLIENT_IMAGE          = "${DOCKERHUB_USER}/devopshub-client"
        IMAGE_TAG             = "${env.BUILD_NUMBER}"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo '📥 Checking out source code from GitHub...'
                checkout scm
            }
        }

        stage('Install & Test') {
            steps {
                echo '🧪 Running Backend Integration Tests...'
                dir('server') {
                    bat 'npm ci || npm install'
                    bat 'node src/tests/api.test.js'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo '🐳 Building Docker Images for DevOpsHub...'
                bat "docker build -t ${SERVER_IMAGE}:${IMAGE_TAG} -t ${SERVER_IMAGE}:latest ./server"
                bat "docker build -t ${CLIENT_IMAGE}:${IMAGE_TAG} -t ${CLIENT_IMAGE}:latest ./client"
            }
        }

        stage('Docker Hub Push') {
            steps {
                echo '🚀 Pushing images to Docker Hub (shivayadav70)...'
                bat "echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin"
                bat "docker push ${SERVER_IMAGE}:${IMAGE_TAG}"
                bat "docker push ${SERVER_IMAGE}:latest"
                bat "docker push ${CLIENT_IMAGE}:${IMAGE_TAG}"
                bat "docker push ${CLIENT_IMAGE}:latest"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo '☸️ Deploying updated DevOpsHub to Kubernetes...'
                bat 'kubectl apply -k ./k8s'
                bat 'kubectl rollout restart deployment/devopshub-server -n devopshub'
                bat 'kubectl rollout restart deployment/devopshub-client -n devopshub'
            }
        }

        stage('Verify Rollout') {
            steps {
                echo '✅ Verifying Kubernetes rollout status...'
                bat 'kubectl rollout status deployment/devopshub-server -n devopshub --timeout=120s'
                bat 'kubectl rollout status deployment/devopshub-client -n devopshub --timeout=120s'
            }
        }
    }

    post {
        always {
            echo '🧹 Pipeline execution completed.'
        }
        success {
            echo '🎉 DevOpsHub build, test, Docker push, and Kubernetes deployment SUCCEEDED!'
        }
        failure {
            echo '❌ DevOpsHub CI/CD pipeline FAILED. Check console logs for details.'
        }
    }
}
