pipeline {
    agent any

    triggers {
        GenericTrigger(
            genericVariables: [],
            token: 'my-deploy-token',
            causeString: 'Triggered by GitHub push',
            printContributedVariables: false,
            printPostContent: false
        )
    }

    environment {
        DEPLOY_USER = 'acloudengineer'
        DEPLOY_HOST = '134.209.211.98'
        DEPLOY_PATH = '/home/acloudengineer/htdocs/www.acloudengineer.com'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    rsync -avz --delete \
                        --exclude='.git' \
                        -e 'ssh -o StrictHostKeyChecking=no' \
                        ./build/ ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/
                """
            }
        }
    }

    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}
