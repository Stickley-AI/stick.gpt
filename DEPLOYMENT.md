# Deployment Guide

This guide covers various options for deploying stick.gpt using GitHub Actions and other methods.

## Deployment Locations

🔗 **Pre-built Docker Images**: [GitHub Container Registry](https://github.com/Stickley-AI/stick.gpt/pkgs/container/stick.gpt)
- Image: `ghcr.io/stickley-ai/stick.gpt`
- Available tags: `latest`, version tags (e.g., `v1.0.0`)

🔗 **GitHub Actions Workflows**: [Actions Dashboard](https://github.com/Stickley-AI/stick.gpt/actions)
- Build and deployment status
- Manual workflow triggers

## Table of Contents

1. [Docker Deployment](#docker-deployment)
2. [npm Package Deployment](#npm-package-deployment)
3. [Cloud Platform Deployment](#cloud-platform-deployment)
4. [Manual Deployment](#manual-deployment)

---

## Docker Deployment

### Using GitHub Actions (Recommended)

The repository includes a GitHub Actions workflow that automatically builds and pushes Docker images to GitHub Container Registry.

#### Automatic Deployment on Tag

When you create a new version tag, the workflow automatically builds and deploys:

```bash
git tag v1.0.1
git push origin v1.0.1
```

This will:
- Build a Docker image
- Push it to `ghcr.io/stickley-ai/stick.gpt`
- Tag it with the version number and `latest`

#### Manual Deployment Trigger

You can manually trigger a deployment from the GitHub Actions tab:

1. Go to Actions → Deploy to Container Registry
2. Click "Run workflow"
3. Select environment (staging/production)
4. Click "Run workflow"

### Pulling and Running the Docker Image

Once deployed, pull and run the image:

```bash
# Pull the image
docker pull ghcr.io/stickley-ai/stick.gpt:latest

# Run with environment variables
docker run -it --rm \
  -e OPENAI_API_KEY="your-api-key-here" \
  ghcr.io/stickley-ai/stick.gpt:latest chat

# Or mount a .env file
docker run -it --rm \
  -v $(pwd)/.env:/app/.env \
  ghcr.io/stickley-ai/stick.gpt:latest chat

# Run a single command
docker run --rm \
  -e OPENAI_API_KEY="your-api-key-here" \
  ghcr.io/stickley-ai/stick.gpt:latest ask "What is Node.js?"
```

### Building Locally

Build the Docker image locally:

```bash
# Build
docker build -t stick-gpt .

# Run
docker run -it --rm -e OPENAI_API_KEY="your-key" stick-gpt chat
```

### Docker Compose (Optional)

Create a `docker-compose.yml` for easier management:

```yaml
version: '3.8'

services:
  stick-gpt:
    image: ghcr.io/stickley-ai/stick.gpt:latest
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - MODEL=${MODEL:-gpt-4o-mini}
      - TEMPERATURE=${TEMPERATURE:-0.7}
    stdin_open: true
    tty: true
    command: chat
```

Run with:
```bash
docker-compose run stick-gpt
```

---

## npm Package Deployment

### Automatic Publishing

The repository includes a workflow that automatically publishes to npm when a release is created.

#### Steps to Publish:

1. Update version in `package.json`:
   ```bash
   npm version patch  # or minor, major
   ```

2. Create a GitHub release:
   - Go to Releases → Create a new release
   - Create a new tag (e.g., v1.0.1)
   - Add release notes
   - Publish release

3. GitHub Actions will automatically:
   - Run tests
   - Publish to npm

#### npm Token Setup

Ensure `NPM_TOKEN` secret is configured in repository settings:
1. Go to Settings → Secrets and variables → Actions
2. Add `NPM_TOKEN` with your npm access token

### Installing from npm

Once published, users can install:

```bash
npm install -g stick.gpt
stick-gpt chat
```

---

## Cloud Platform Deployment

### Azure Container Instances

Deploy the Docker image to Azure:

```bash
# Login to Azure
az login

# Create a resource group
az group create --name stick-gpt-rg --location eastus

# Create container instance
az container create \
  --resource-group stick-gpt-rg \
  --name stick-gpt \
  --image ghcr.io/stickley-ai/stick.gpt:latest \
  --environment-variables OPENAI_API_KEY=$OPENAI_API_KEY \
  --restart-policy Never \
  --interactive
```

### AWS ECS/Fargate

1. Push image to Amazon ECR
2. Create ECS task definition
3. Run task with environment variables

```bash
# Tag for ECR
docker tag ghcr.io/stickley-ai/stick.gpt:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/stick-gpt:latest

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/stick-gpt:latest
```

### Google Cloud Run

Deploy to Cloud Run:

```bash
# Deploy from GitHub Container Registry
gcloud run deploy stick-gpt \
  --image ghcr.io/stickley-ai/stick.gpt:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars OPENAI_API_KEY=$OPENAI_API_KEY
```

### Heroku

Deploy using Heroku Container Registry:

```bash
# Login to Heroku
heroku login
heroku container:login

# Create app
heroku create stick-gpt-app

# Set environment variables
heroku config:set OPENAI_API_KEY=your-key -a stick-gpt-app

# Tag and push
docker tag ghcr.io/stickley-ai/stick.gpt:latest \
  registry.heroku.com/stick-gpt-app/web

docker push registry.heroku.com/stick-gpt-app/web

# Release
heroku container:release web -a stick-gpt-app
```

### Kubernetes

Create Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: stick-gpt
spec:
  replicas: 1
  selector:
    matchLabels:
      app: stick-gpt
  template:
    metadata:
      labels:
        app: stick-gpt
    spec:
      containers:
      - name: stick-gpt
        image: ghcr.io/stickley-ai/stick.gpt:latest
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: stick-gpt-secrets
              key: openai-api-key
        stdin: true
        tty: true
```

---

## Manual Deployment

### Direct Server Deployment

Deploy to a server manually:

```bash
# SSH to your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/Stickley-AI/stick.gpt.git
cd stick.gpt

# Install dependencies
npm ci --only=production

# Create .env file
cp .env.example .env
# Edit .env with your API key

# Run the app
node cli.js chat
```

### Using PM2 for Process Management

Keep the app running with PM2:

```bash
# Install PM2
npm install -g pm2

# Start the app
pm2 start cli.js --name stick-gpt -- chat

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

### Systemd Service

Create a systemd service on Linux:

```ini
[Unit]
Description=stick.gpt AI Agent
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/path/to/stick.gpt
Environment="OPENAI_API_KEY=your-key"
ExecStart=/usr/bin/node /path/to/stick.gpt/cli.js chat
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable stick-gpt
sudo systemctl start stick-gpt
```

---

## Environment Variables

All deployment methods support these environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | (required) |
| `MODEL` | OpenAI model to use | `gpt-4o-mini` |
| `TEMPERATURE` | Response randomness (0.0-2.0) | `0.7` |
| `MAX_TOKENS` | Maximum tokens in response | `2000` |

---

## Security Considerations

### Secrets Management

1. **Never commit secrets** to the repository
2. Use GitHub Secrets for CI/CD
3. Use cloud provider secret managers for production
4. Rotate API keys regularly

### Docker Security

1. Images run as non-root user
2. Use multi-stage builds to reduce image size
3. Scan images for vulnerabilities
4. Use specific version tags in production

### Network Security

1. Use HTTPS for all API communications
2. Implement rate limiting if exposing as a service
3. Use VPC/private networks in cloud deployments
4. Monitor API usage and costs

---

## Monitoring and Logging

### Docker Logs

```bash
# View container logs
docker logs -f container-name

# Export logs
docker logs container-name > stick-gpt.log
```

### Cloud Platform Monitoring

- **Azure**: Use Application Insights
- **AWS**: Use CloudWatch
- **GCP**: Use Cloud Logging
- **Heroku**: Use Heroku Logs

---

## Troubleshooting

### Common Issues

1. **API Key not found**
   - Ensure `OPENAI_API_KEY` is set
   - Check environment variable name spelling

2. **Docker image won't run**
   - Check image was pulled correctly
   - Verify environment variables are passed

3. **npm publish fails**
   - Verify `NPM_TOKEN` secret is set
   - Check npm package name availability

### Getting Help

- Check [README.md](README.md) for basic usage
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development
- Open an issue on GitHub

---

## CI/CD Pipeline Summary

The repository includes three GitHub Actions workflows:

1. **test.yml** - Runs on every push/PR
   - Tests on Node.js 18.x and 20.x
   - Verifies CLI commands

2. **publish.yml** - Runs on release creation
   - Publishes to npm registry

3. **deploy.yml** - Runs on tag push or manual trigger
   - Builds Docker image
   - Pushes to GitHub Container Registry
   - Tags with version and latest

---

## Next Steps

1. Set up required secrets in GitHub repository
2. Tag a release to trigger deployment
3. Pull and test the Docker image
4. Set up monitoring for your deployment

For questions or issues, please open an issue on GitHub.
