# Kubernetes Deployment Example

This directory contains example Kubernetes configurations for deploying stick.gpt.

## Files

- `deployment.yaml` - Complete Kubernetes deployment with Secret, ConfigMap, and Deployment

## Prerequisites

- Kubernetes cluster (local or cloud)
- kubectl configured to access your cluster
- Docker image available at `ghcr.io/stickley-ai/stick.gpt:latest`

## Quick Start

1. **Update the Secret** with your OpenAI API key:
   ```bash
   # Edit deployment.yaml and replace "your-openai-api-key-here" with your actual API key
   ```

2. **Apply the configuration**:
   ```bash
   kubectl apply -f deployment.yaml
   ```

3. **Check the deployment**:
   ```bash
   kubectl get pods -l app=stick-gpt
   ```

4. **View logs**:
   ```bash
   kubectl logs -f deployment/stick-gpt
   ```

5. **Access the pod interactively**:
   ```bash
   kubectl exec -it deployment/stick-gpt -- node /app/cli.js chat
   ```

## Using kubectl create secret

For better security, create the secret separately:

```bash
# Create secret from literal value
kubectl create secret generic stick-gpt-secrets \
  --from-literal=openai-api-key=your-actual-api-key

# Or from file
echo -n 'your-actual-api-key' > openai-key.txt
kubectl create secret generic stick-gpt-secrets \
  --from-file=openai-api-key=openai-key.txt
rm openai-key.txt

# Then remove the Secret section from deployment.yaml and apply
kubectl apply -f deployment.yaml
```

## Customization

### Change Model or Parameters

Edit the ConfigMap in `deployment.yaml`:

```yaml
data:
  MODEL: "gpt-4o"  # or gpt-4, gpt-3.5-turbo
  TEMPERATURE: "0.5"
  MAX_TOKENS: "4000"
```

### Adjust Resources

Modify resource requests and limits based on your needs:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "1000m"
```

### Scale Replicas

Increase the number of replicas:

```bash
kubectl scale deployment stick-gpt --replicas=3
```

## Cleanup

Remove all resources:

```bash
kubectl delete -f deployment.yaml
```

## Notes

- The default deployment uses `stdin: true` and `tty: true` for interactive mode
- Resource limits can be adjusted based on your workload
- The image is pulled from GitHub Container Registry
- Consider using a private registry for production deployments

## Troubleshooting

### Pod not starting

```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

### Check secret

```bash
kubectl get secret stick-gpt-secrets -o yaml
```

### Check configmap

```bash
kubectl get configmap stick-gpt-config -o yaml
```

For more deployment options, see [DEPLOYMENT.md](../../DEPLOYMENT.md) in the root directory.
