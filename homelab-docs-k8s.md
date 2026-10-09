# 🏠 Homelab Documentation — Network Engineer Setup

> **Author:** Nurlatief Adhi Jagad
> **Last Updated:** October 9, 2026
> **Purpose:** Dokumentasi lengkap setup homelab production-grade untuk portfolio & learning
---
## 📑 Table of Contents

1. Overview & Arsitektur
2. Cluster k3s-main (Production)
3. Cluster k3s-lxd (Lab with Macvlan)
4. Network Architecture
5. Docker Services
6. CI/CD Pipeline
7. Monitoring Stack
8. LXD Container Management
9. Troubleshooting Log
10. Skills Demonstrated
11. Cheatsheet
---
## 1. Overview & Arsitektur

### 1.1 Tujuan

Membangun homelab production-grade yang mencakup:

- ✅ Portfolio website dengan CI/CD automation
- ✅ Kubernetes multi-cluster (production + lab)
- ✅ Network monitoring (ICMP + HTTP probes)
- ✅ Container isolation dengan LXD
- ✅ Zero-trust access via Cloudflare Tunnel

### 1.2 Hardware & Software

| Komponen    | Spesifikasi                |
| ----------- | -------------------------- |
| **Host**    | Debian 13 (Trixie)         |
| **CPU**     | x86_64                     |
| **RAM**     | 7.6 GB                     |
| **Storage** | 104 GB (SSD)               |
| **Network** | eno1 (192.168.100.32)      |
| **Router**  | ISP Router (192.168.100.1) |

### 1.3 Arsitektur High-Level
```
┌────────────────────────────────────────────────────────────────┐
│                         INTERNET                               │
│                            │                                   │
│                            ▼                                   │
│              ┌──────────────────────────┐                      │
│              │   Cloudflare Edge (TLS)  │                      │
│              └──────────────┬───────────┘                      │
│                             │                                  │
│                    Cloudflare Tunnel                           │
│                             │                                  │
└─────────────────────────────┼──────────────────────────────────┘
                              │
┌─────────────────────────────┼──────────────────────────────────┐
│  VM Debian (192.168.100.32) │                                  │
│                             ▼                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  cloudflared (systemd)                                     ││
│  └──────────────────────────┬─────────────────────────────────┘│
│                             │                                  │
│  ┌──────────────────────────┼─────────────────────────────────┐│
│  │       Cluster k3s-main   ▼                                 ││
│  │  ┌──────────────────────────────────────┐                  ││
│  │  │  Traefik Ingress (MetalLB .200)      │                  ││
│  │  │  ├─ lokal.arahabaki.my.id → Portfolio│                  ││
│  │  │  └─ grafana-k8s.arahabaki.my.id      │                  ││
│  │  └──────────────────────────────────────┘                  ││
│  │                                                            ││
│  │  Node: cihuy (VM host itself)                              ││
│  │  ├─ Portfolio (2 replicas)                                 ││
│  │  ├─ Prometheus + Grafana + Alertmanager                    ││
│  │  └─ Blackbox Exporter (ICMP + HTTP probes)                 ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  LXD Containers (macvlan .250-.252)                        ││
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                 ││
│  │  │ubuntu-01 │  │ubuntu-02 │  │ubuntu-03 │                 ││
│  │  │ .250     │  │ .251     │  │ .252     │                 ││
│  │  │ k3s Srv  │  │ k3s Agt  │  │ k3s Agt  │                 ││
│  │  └──────────┘  └──────────┘  └──────────┘                 ││
│  │       └── Cluster k3s-lxd (MetalLB .211-.215)              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Docker Containers                                         ││
│  │  ├─ GenieACS (UI, NBI, CWMP, FS)                           ││
│  │  ├─ MongoDB                                                 ││
│  │  ├─ Project MikroTik SD-WAN backend                        ││
│  │  └─ Zabbix + PostgreSQL (MikroTik monitoring)              ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                │
│  ┌────────────────────────────────────────────────────────────┐│
│  │  Host Networking                                           ││
│  │  ├─ macv0 (192.168.100.200) - macvlan for host↔container  ││
│  │  └─ lxdbr0 (10.79.195.0/24) - legacy LXD NAT               ││
│  └────────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────────┘
```
---
## 2. Cluster k3s-main (Production)

### 2.1 Spesifikasi

| Aspek            | Nilai                            |
| ---------------- | -------------------------------- |
| **Cluster Name** | k3s-main                         |
| **Context**      | `k3s-main`                       |
| **Nodes**        | 1 (single-node, VM host)         |
| **Node IP**      | 192.168.100.32                   |
| **Pod CIDR**     | Default (10.42.0.0/16)           |
| **Service CIDR** | Default (10.43.0.0/16)           |
| **Ingress**      | Traefik                          |
| **LoadBalancer** | MetalLB pool 192.168.100.200-210 |

### 2.2 Applications

| App                   | Namespace  | Replicas | Ingress                     |
| --------------------- | ---------- | -------- | --------------------------- |
| **Portfolio**         | default    | 2        | lokal.arahabaki.my.id       |
| **Grafana**           | monitoring | 1        | grafana-k8s.arahabaki.my.id |
| **Prometheus**        | monitoring | 1        | Internal                    |
| **Alertmanager**      | monitoring | 1        | Internal                    |
| **Blackbox Exporter** | monitoring | 1        | Internal                    |

### 2.3 Portfolio Deployment

**Repo:** https://github.com/NrlatiefAdhi/learn-k8s

**Tech Stack:**

- React 18 + Vite 6 + Tailwind CSS 4
- TypeScript
- Multi-stage Docker build (Node 20 → Nginx Alpine)
- 74 MB image, non-root user, read-only rootfs

**Dockerfile (key points):**
```
# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM nginx:1.27-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
USER app
EXPOSE 8020
```
**Kubernetes Deployment:**
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
  namespace: default
spec:
  replicas: 2
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      imagePullSecrets:
        - name: ghcr-pull-secret
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: portfolio
          image: ghcr.io/nrlatiefadhi/portfolio:sha-xxxxxxx
          ports:
            - name: http
              containerPort: 8020
          resources:
            requests: { cpu: "50m", memory: "64Mi" }
            limits:   { cpu: "250m", memory: "256Mi" }
          livenessProbe:
            httpGet: { path: /healthz, port: http }
          readinessProbe:
            httpGet: { path: /healthz, port: http }
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
          volumeMounts:
            - { name: nginx-cache, mountPath: /var/cache/nginx }
            - { name: nginx-run,   mountPath: /var/run }
            - { name: nginx-tmp,   mountPath: /tmp }
```
### 2.4 Ingress Configuration
```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio
  namespace: default
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web
spec:
  ingressClassName: traefik
  rules:
    - host: lokal.arahabaki.my.id
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: portfolio
                port:
                  number: 80
```
---
## 3. Cluster k3s-lxd (Lab with Macvlan)

### 3.1 Spesifikasi

| Aspek            | Nilai                            |
| ---------------- | -------------------------------- |
| **Cluster Name** | k3s-lxd                          |
| **Context**      | `k3s-lxd`                        |
| **Nodes**        | 3 (1 server + 2 agent)           |
| **Network**      | LXD Macvlan (LAN IP)             |
| **Pod CIDR**     | **10.252.0.0/16**                |
| **Service CIDR** | **10.253.0.0/16**                |
| **Ingress**      | Traefik                          |
| **LoadBalancer** | MetalLB pool 192.168.100.211-215 |

### 3.2 Node Allocation

| Node      | IP              | Role                             | LXD Container |
| --------- | --------------- | -------------------------------- | ------------- |
| ubuntu-01 | 192.168.100.250 | k3s server (control-plane, etcd) | ubuntu-01     |
| ubuntu-02 | 192.168.100.251 | k3s agent (worker)               | ubuntu-02     |
| ubuntu-03 | 192.168.100.252 | k3s agent (worker)               | ubuntu-03     |

### 3.3 Macvlan Setup

**Network config di LXD:**
```
lxc network create lan0 --type=macvlan parent=eno1
```
**Host macvlan interface (`macv0`):**
```
# /etc/systemd/system/macv0.service
[Unit]
Description=macv0 macvlan interface for LXD
After=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStartPre=/bin/sleep 5
ExecStart=/bin/bash -c 'ip link add macv0 link eno1 type macvlan mode bridge; \
  ip addr add 192.168.100.200/32 dev macv0; \
  ip link set macv0 up; sleep 2; \
  ip route add 192.168.100.250/32 dev macv0; \
  ip route add 192.168.100.251/32 dev macv0; \
  ip route add 192.168.100.252/32 dev macv0; \
  for i in 211 212 213 214 215; do \
    ip route add 192.168.100.$i/32 dev macv0; \
  done'
ExecStop=/bin/bash -c 'ip link del macv0'

[Install]
WantedBy=multi-user.target
```
**LXD Profile `k3s-cluster`:**
```
config:
  raw.lxc: |-
    lxc.apparmor.profile = unconfined
    lxc.cap.drop =
    lxc.cgroup2.devices.allow = a
    lxc.mount.auto = proc:rw sys:rw
  security.nesting: "true"
  security.privileged: "true"
devices:
  bpf:
    path: /sys/fs/bpf
    source: /sys/fs/bpf
    type: disk
  eth0:
    name: eth0
    network: lan0
    type: nic
  kmsg:
    mode: "0666"
    path: /dev/kmsg
    type: unix-char
  kvm:
    mode: "0666"
    path: /dev/kvm
    type: unix-char
  tun:
    mode: "0666"
    path: /dev/net/tun
    type: unix-char
```
### 3.4 k3s Installation

**Server (ubuntu-01):**
```
curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="server \
  --cluster-init \
  --cluster-cidr=10.252.0.0/16 \
  --service-cidr=10.253.0.0/16 \
  --node-ip=192.168.100.250 \
  --advertise-address=192.168.100.250 \
  --tls-san=192.168.100.250 \
  --disable=traefik \
  --disable=servicelb \
  --token=SECRET" sh -
```
**Agent (ubuntu-02, ubuntu-03):**
```
NODE_TOKEN=$(cat /var/lib/rancher/k3s/server/node-token)

# ubuntu-02
curl -sfL https://get.k3s.io | \
  K3S_URL=https://192.168.100.250:6443 \
  K3S_TOKEN=$NODE_TOKEN \
  sh -s - agent --node-ip=192.168.100.251

# ubuntu-03
curl -sfL https://get.k3s.io | \
  K3S_URL=https://192.168.100.250:6443 \
  K3S_TOKEN=$NODE_TOKEN \
  sh -s - agent --node-ip=192.168.100.252
```
### 3.5 MetalLB Configuration
```
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: lan-pool
  namespace: metallb-system
spec:
  addresses:
    - 192.168.100.211-192.168.100.215
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: lan-l2
  namespace: metallb-system
spec:
  ipAddressPools:
    - lan-pool
```
### 3.6 Known Limitation — ICMP in Macvlan

⚠️ **ICMP (ping) ke MetalLB VIP tidak berfungsi di macvlan.**

| Protocol        | Status            |
| --------------- | ----------------- |
| ARP             | ✅ Works           |
| HTTP/HTTPS      | ✅ Works           |
| TCP             | ✅ Works           |
| **ICMP (ping)** | ❌ Tidak berfungsi |

**Penjelasan:** Di macvlan, parent interface tidak bisa komunikasi langsung dengan child, dan kernel tidak "memiliki" VIP sehingga tidak respond ICMP. Untuk TCP/HTTP, kube-proxy handle DNAT dan works.

**Workaround untuk troubleshooting:** Gunakan `curl` atau `nc`, bukan `ping`:
```
# Bukan ping
curl -I http://192.168.100.211
nc -zv 192.168.100.211 80
```
---
## 4. Network Architecture

### 4.1 IP Allocation

| Host/Service         | IP                  | Keterangan                |
| -------------------- | ------------------- | ------------------------- |
| Router ISP           | 192.168.100.1       | Gateway                   |
| VM Debian (eno1)     | 192.168.100.32      | Host utama                |
| **Host macv0**       | 192.168.100.200     | Macvlan interface di host |
| **MetalLB k3s-main** | 192.168.100.200-210 | Pool untuk cluster main   |
| **LXD ubuntu-01**    | 192.168.100.250     | k3s-lxd server            |
| **LXD ubuntu-02**    | 192.168.100.251     | k3s-lxd agent             |
| **LXD ubuntu-03**    | 192.168.100.252     | k3s-lxd agent             |
| **MetalLB k3s-lxd**  | 192.168.100.211-215 | Pool untuk cluster LXD    |

### 4.2 CIDR Allocation

| Cluster             | Pod CIDR          | Service CIDR      |
| ------------------- | ----------------- | ----------------- |
| k3s-main            | 10.42.0.0/16      | 10.43.0.0/16      |
| k3s-lxd             | **10.252.0.0/16** | **10.253.0.0/16** |
| LXD bridge (lxdbr0) | 10.79.195.0/24    | —                 |

### 4.3 Cloudflare Tunnel

**Config:** `/etc/cloudflared/config.yml`
```
tunnel: <tunnel-id>
credentials-file: /etc/cloudflared/<tunnel-id>.json

ingress:
  - hostname: lokal.arahabaki.my.id
    service: http://192.168.100.200:80
  - hostname: grafana-k8s.arahabaki.my.id
    service: http://192.168.100.200:80
  - service: http_status:404
```
**DNS Records (Cloudflare):**

| Hostname                    | Target                                                            | Proxy   |
| --------------------------- | ----------------------------------------------------------------- | ------- |
| lokal.arahabaki.my.id       | [tunnel-id.cfargotunnel.com](https://tunnel-id.cfargotunnel.com/) | Proxied |
| grafana-k8s.arahabaki.my.id | [tunnel-id.cfargotunnel.com](https://tunnel-id.cfargotunnel.com/) | Proxied |
---
## 5. Docker Services

### 5.1 Container Inventory

| Container                      | Image                  | Port  | Status  |
| ------------------------------ | ---------------------- | ----- | ------- |
| genieacs-ui                    | genieacs-genieacs-ui   | 3010  | Running |
| genieacs-nbi                   | genieacs-genieacs-nbi  | 7557  | Running |
| genieacs-cwmp                  | genieacs-genieacs-cwmp | 7547  | Running |
| genieacs-fs                    | genieacs-genieacs-fs   | 7567  | Running |
| genieacs-mongo                 | mongo:6                | 27017 | Running |
| project-mikrotik-sdwan-backend | custom                 | 8000  | Running |

### 5.2 Stopped Services (Memory Optimization)

| Service           | Image                    | Reason                  |
| ----------------- | ------------------------ | ----------------------- |
| genieacs-backend  | genieacs-backend-backend | Not needed              |
| genieacs-frontend | genieacs-frontend        | Not needed              |
| Zabbix            | System service           | Temporary               |
| PostgreSQL        | System service           | Temporary               |
| MongoDB (extra)   | System service           | Temporary               |
| Grafana (deb)     | System service           | Replaced by k8s Grafana |
| uptime-kuma       | Container                | Replaced by Blackbox    |

**Total RAM saved:** \~500 MB
---
## 6. CI/CD Pipeline

### 6.1 Overview
```
┌──────────────────────────────────────────────────────────────┐
│  Developer pushes to main branch                             │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  GitHub Actions (Cloud Runner: ubuntu-latest)            ││
│  │  Job: Lint, Build & Push                                 ││
│  │  1. Checkout code                                        ││
│  │  2. Setup Node 20                                        ││
│  │  3. npm ci --include=dev                                 ││
│  │  4. npm run build                                        ││
│  │  5. Docker buildx build                                  ││
│  │  6. Push to ghcr.io with tag sha-<commit>               ││
│  └──────────────────────────────────────────────────────────┘│
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  Self-Hosted Runner (VM cihuy)                           ││
│  │  Job: Deploy to Kubernetes                               ││
│  │  1. Checkout code                                        ││
│  │  2. Update kustomization.yaml dengan tag baru           ││
│  │  3. kubectl apply -k k8s/                                ││
│  │  4. kubectl rollout status                               ││
│  └──────────────────────────────────────────────────────────┘│
│                          ↓                                   │
│  Deployment live in ~6 minutes                               │
└──────────────────────────────────────────────────────────────┘
```
### 6.2 Workflow File

**Location:** `.github/workflows/build-and-deploy.yml`
```
name: Build & Deploy Portfolio

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

on:
  push:
    branches: [main]
    tags: ["v*"]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository_owner }}/portfolio

jobs:
  build:
    name: Lint, Build & Push
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci --include=dev
      - run: npm run lint --if-present
      - run: npm run build
      - uses: docker/setup-buildx-action@v3
      - if: github.event_name == 'push'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,format=short,prefix=sha-
            type=ref,event=tag
            type=raw,value=latest,enable={{is_default_branch}}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: ${{ github.event_name == 'push' }}
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: Deploy to Kubernetes
    needs: build
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: self-hosted
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - name: Update image tag
        run: |
          SHORT_SHA=$(echo "${{ github.sha }}" | cut -c1-7)
          cd k8s
          sed -i "s|newTag: .*|newTag: sha-${SHORT_SHA}|" kustomization.yaml
      - name: Apply manifests
        run: kubectl apply -k k8s/
      - name: Verify rollout
        run: kubectl -n default rollout status deployment/portfolio --timeout=180s
```
### 6.3 Self-Hosted Runner

**Setup:**
```
# Install runner di VM
mkdir -p ~/actions-runner && cd ~/actions-runner
curl -o actions-runner-linux-x64.tar.gz -L \
  https://github.com/actions/runner/releases/download/v2.330.0/actions-runner-linux-x64-2.330.0.tar.gz
tar xzf ./actions-runner-linux-x64.tar.gz

# Configure
./config.sh \
  --url https://github.com/NrlatiefAdhi/learn-k8s \
  --token <REGISTRATION-TOKEN> \
  --name cihuy \
  --labels self-hosted,Linux,X64 \
  --work _work \
  --unattended

# Install as service
sudo ./svc.sh install
sudo ./svc.sh start
```
**Service:**
```
/etc/systemd/system/actions.runner.NrlatiefAdhi-learn-k8s.cihuy.service
```
---
## 7. Monitoring Stack

### 7.1 Components

| Component              | Version | Purpose                 |
| ---------------------- | ------- | ----------------------- |
| **Prometheus**         | v2.x    | Metrics storage & query |
| **Grafana**            | 13.2.x  | Visualization           |
| **Alertmanager**       | v0.27.x | Alert routing           |
| **Blackbox Exporter**  | v0.25.x | ICMP/HTTP/TCP probes    |
| **Node Exporter**      | v1.8.x  | Host metrics            |
| **kube-state-metrics** | v2.x    | K8s object metrics      |

### 7.2 Installation
```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring \
  --create-namespace \
  --set prometheus.prometheusSpec.retention=2d \
  --set prometheus.prometheusSpec.resources.requests.memory=384Mi \
  --set prometheus.prometheusSpec.resources.limits.memory=512Mi \
  --set prometheus.prometheusSpec.serviceMonitorSelectorNilUsesHelmValues=false \
  --set prometheus.prometheusSpec.probeSelectorNilUsesHelmValues=false \
  --set grafana.adminPassword='<password>' \
  --set grafana.resources.requests.memory=256Mi \
  --set grafana.resources.limits.memory=1024Mi \
  --set grafana.extraEmptyDirMounts[0].name=plugins \
  --set grafana.extraEmptyDirMounts[0].mountPath=/var/lib/grafana/plugins \
  --set grafana.env.GF_PLUGINS_PREINSTALL_DISABLED='true'
```
### 7.3 Blackbox Probe Configuration

**ICMP Probe (network-icmp):**
```
apiVersion: monitoring.coreos.com/v1
kind: Probe
metadata:
  name: network-icmp
  namespace: monitoring
spec:
  interval: 30s
  module: icmp
  prober:
    url: blackbox-exporter-prometheus-blackbox-exporter.monitoring.svc:9115
  targets:
    staticConfig:
      static:
        - 192.168.100.1    # Gateway
        - 1.1.1.1          # Cloudflare DNS
        - 8.8.8.8          # Google DNS
```
**HTTP Probe (network-http):**
```
apiVersion: monitoring.coreos.com/v1
kind: Probe
metadata:
  name: network-http
  namespace: monitoring
spec:
  interval: 30s
  module: http_2xx
  prober:
    url: blackbox-exporter-prometheus-blackbox-exporter.monitoring.svc:9115
  targets:
    staticConfig:
      static:
        - https://lokal.arahabaki.my.id
        - https://grafana-k8s.arahabaki.my.id
```
### 7.4 Useful PromQL Queries
```
# Target status (1=up, 0=down)
probe_success{job=~"probe/monitoring/network-.*"}

# Latency (in seconds)
probe_duration_seconds{job=~"probe/monitoring/network-.*"}

# HTTP status code
probe_http_status_code

# TLS cert expiry (in seconds until expiry)
probe_ssl_earliest_cert_expiry - time()
```
### 7.5 Alert Rules
```
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: network-probes
  namespace: monitoring
spec:
  groups:
    - name: blackbox
      interval: 30s
      rules:
        - alert: NetworkProbeDown
          expr: probe_success{job=~"probe/monitoring/network-.*"} == 0
          for: 2m
          labels:
            severity: critical
          annotations:
            summary: "Network target {{ $labels.instance }} is DOWN"
```
---
## 8. LXD Container Management

### 8.1 Container Inventory

| Container | IP              | OS           | Purpose    | RAM      |
| --------- | --------------- | ------------ | ---------- | -------- |
| ubuntu-01 | 192.168.100.250 | Ubuntu 20.04 | k3s server | \~500 MB |
| ubuntu-02 | 192.168.100.251 | Ubuntu 20.04 | k3s agent  | \~400 MB |
| ubuntu-03 | 192.168.100.252 | Ubuntu 20.04 | k3s agent  | \~400 MB |

### 8.2 Common Commands
```
# List containers
lxc list

# Start/stop
lxc start ubuntu-01
lxc stop ubuntu-01
lxc restart ubuntu-01

# Exec into container
lxc exec ubuntu-01 -- bash

# Show config
lxc config show ubuntu-01
lxc profile show k3s-cluster

# Snapshot
lxc snapshot ubuntu-01 before-update
lxc restore ubuntu-01 before-update

# Clone
lxc copy ubuntu-01 ubuntu-04
```
### 8.3 LXDWare Dashboard

**URL:** `http://192.168.100.32` (di VM host)
**Config:** `/var/www/html/lxd-dashboard/`

**Setup credentials:** Dibuat saat first login.

**Add host manually:**

- Address: `127.0.0.1`
- Port: `8443`
- Alias: `Cihuy`
- External Address: `192.168.100.32`
- External Port: `8443`
---
## 9. Troubleshooting Log

### 9.1 Docker Build — `vite: not found`

**Symptom:**
```
ERROR: RUN npm run build — sh: vite: not found
```
**Root Cause:** `npm ci` tidak install devDependencies saat build di container.

**Fix:**
```
RUN npm ci --include=dev
```
---
### 9.2 Docker Build — DNS `EAI_AGAIN`

**Symptom:**
```
npm error code EAI_AGAIN
npm error request to https://registry.npmjs.org/npm failed
```
**Root Cause:** Docker container tidak bisa resolve DNS.

**Fix:**
```
# Tambah DNS di Docker daemon
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "dns": ["1.1.1.1", "8.8.8.8"],
  "dns-opts": ["ndots:1"]
}
EOF
sudo systemctl restart docker

# Atau pakai --network=host saat build
docker build --network=host -t portfolio:local .
```
---
### 9.3 Grafana — `Plugin not available`

**Symptom:** Plugin Prometheus tidak bisa load di Grafana v13.2+.

**Root Cause:** Grafana v13.2+ tidak lagi bundled Prometheus plugin; butuh install via background installer yang gagal karena permission.

**Fix:**
```
helm upgrade monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring --reuse-values \
  --set grafana.extraEmptyDirMounts[0].name=plugins \
  --set grafana.extraEmptyDirMounts[0].mountPath=/var/lib/grafana/plugins
```
---
### 9.4 Grafana — OOMKilled

**Symptom:**
```
Last State: Terminated
Reason: OOMKilled
Exit Code: 137
```
**Root Cause:** Grafana pakai 535 MB, limit hanya 512 MB.

**Fix:**
```
helm upgrade monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring --reuse-values \
  --set grafana.resources.limits.memory=1024Mi \
  --set grafana.env.GF_PLUGINS_PREINSTALL_DISABLED='true'
```
---
### 9.5 k3s in LXD — Kernel Modules Missing

**Symptom:** k3s fails to start, no clear error.

**Root Cause:** Container tidak bisa load kernel modules (overlay, br_netfilter).

**Fix (di host):**
```
sudo tee /etc/modules-load.d/k3s.conf > /dev/null <<EOF
overlay
br_netfilter
nf_conntrack
EOF

sudo modprobe overlay
sudo modprobe br_netfilter
sudo modprobe nf_conntrack
```
---
### 9.6 LXD Container No Internet (NAT)

**Symptom:** Container bisa ping router tapi tidak bisa akses internet.

**Root Cause:** LXD NAT rules tidak ter-generate di iptables.

**Fix:**
```
# Cek NAT rules
sudo iptables -t nat -L POSTROUTING -n | grep 10.79

# Kalau kosong, add manual
sudo iptables -t nat -A POSTROUTING -s 10.79.0.0/24 ! -d 10.79.0.0/24 -j MASQUERADE

# Persist
sudo mkdir -p /etc/iptables
sudo iptables-save | sudo tee /etc/iptables/rules.v4 > /dev/null
```
---
### 9.7 Macvlan — Host Cannot Reach Container

**Symptom:**
```
connect: no route to host (192.168.100.250)
```
**Root Cause:** Macvlan limitation — parent interface (eno1) tidak bisa komunikasi dengan child.

**Fix:** Buat macv0 (macvlan child di host) + tambah route eksplisit:
```
# Buat macv0
sudo ip link add macv0 link eno1 type macvlan mode bridge
sudo ip addr add 192.168.100.200/32 dev macv0
sudo ip link set macv0 up

# Route ke container
sudo ip route add 192.168.100.250/32 dev macv0
sudo ip route add 192.168.100.251/32 dev macv0
sudo ip route add 192.168.100.252/32 dev macv0
```
**Persist:** Via systemd service `macv0.service` (lihat Section 3.3).
---
### 9.8 GitHub Actions — `workflow` scope error

**Symptom:**
```
! [remote rejected] main -> main
(refusing to allow a Personal Access Token to create or update workflow
`.github/workflows/build-and-deploy.yml` without `workflow` scope)
```
**Root Cause:** PAT tidak punya scope `workflow`.

**Fix:** Buat PAT baru dengan scope `repo` + `workflow`.
---
### 9.9 GitHub Actions — `permission_denied: write_package`

**Symptom:**
```
ERROR: failed to push ghcr.io/...: denied: permission_denied: write_package
```
**Root Cause:** Repo Actions permissions default "Read-only", atau package ownership conflict.

**Fix:**

1. Repo → Settings → Actions → Workflow permissions → **Read and write**
2. Package settings → Manage Actions access → Add repo → **Write**
---
## 10. Skills Demonstrated

### 10.1 Technical Skills

| Category            | Skills                                                           |
| ------------------- | ---------------------------------------------------------------- |
| **OS**              | Debian 13, Ubuntu 20.04, Linux sysadmin                          |
| **Container**       | Docker, LXD, containerd, Podman                                  |
| **Orchestration**   | Kubernetes (k3s), multi-node cluster, stateful workloads         |
| **Networking**      | Macvlan, bridge, NAT, iptables, routing, ARP, BGP (basic)        |
| **Ingress**         | Traefik, MetalLB, Ingress controllers                            |
| **Observability**   | Prometheus, Grafana, Alertmanager, Blackbox Exporter             |
| **CI/CD**           | GitHub Actions, self-hosted runner, GHCR                         |
| **Security**        | Non-root containers, seccomp, capability drop, Cloudflare Tunnel |
| **IaC**             | Kustomize, Helm, systemd units                                   |
| **Troubleshooting** | dmesg, journalctl, kubectl, lxc, network debugging               |

### 10.2 Soft Skills

- **Architecture thinking** — design multi-cluster setup
- **Documentation** — comprehensive README + runbooks
- **Problem-solving** — debug OOM, NAT, macvlan limitation
- **Iterative approach** — build, test, fix, repeat

### 10.3 Projects Portfolio

1. **Portfolio Website** — React + Vite + Kubernetes + CI/CD
2. **Network Monitoring Stack** — Prometheus + Blackbox + Grafana
3. **k3s-lxd Lab** — Multi-node cluster in LXD containers with macvlan
4. **GenieACS Deployment** — ONT management platform
5. **SD-WAN Backend** — MikroTik automation platform
---
## 11. Cheatsheet

### 11.1 kubectl Contexts
```
# List contexts
kubectl config get-contexts

# Switch
kubectl config use-context k3s-main
kubectl config use-context k3s-lxd

# Alias (add to ~/.bashrc)
alias kmain='kubectl config use-context k3s-main && kubectl'
alias klxd='kubectl config use-context k3s-lxd && kubectl'

# k9s per cluster
alias k9main='KUBECONFIG=~/.kube/config k9s --context k3s-main'
alias k9lxd='KUBECONFIG=~/.kube/config k9s --context k3s-lxd'
```
### 11.2 LXD Commands
```
# Container lifecycle
lxc list
lxc start <container>
lxc stop <container>
lxc restart <container>
lxc exec <container> -- bash

# Network
lxc network list
lxc network show lan0
lxc network show lxdbr0

# Profile
lxc profile list
lxc profile show k3s-cluster

# Snapshot
lxc snapshot <container> <name>
lxc info <container>
lxc restore <container> <snapshot-name>
```
### 11.3 Kubernetes Debug
```
# Pod issues
kubectl get pods -o wide
kubectl describe pod <pod>
kubectl logs <pod> --tail=100
kubectl logs <pod> --previous     # Previous crashed container

# Events
kubectl get events --sort-by='.lastTimestamp'

# Resource usage
kubectl top nodes
kubectl top pods -A --sort-by=memory | head -20

# Ingress
kubectl get ingress -A
kubectl describe ingress <name> -n <ns>

# Rollback
kubectl rollout history deployment/<name>
kubectl rollout undo deployment/<name>
```
### 11.4 System Health
```
# RAM
free -h

# Disk
df -h /

# Load
uptime

# Top processes
ps aux --sort=-%mem | head -15

# OOM events
sudo dmesg | grep -i "oom\|killed process" | tail -20

# Service status
systemctl status <service>
journalctl -u <service> --no-pager | tail -30
```
### 11.5 Cloudflared
```
# Status
sudo systemctl status cloudflared

# Restart
sudo systemctl restart cloudflared

# Logs
sudo journalctl -u cloudflared --tail=50

# Config
sudo cat /etc/cloudflared/config.yml
```
### 11.6 Backup
```
# Backup config & kubeconfig
mkdir -p ~/backups/$(date +%Y%m%d)
cp -r ~/.kube ~/backups/$(date +%Y%m%d)/
lxc list > ~/backups/$(date +%Y%m%d)/lxd-containers.txt
sudo iptables-save > ~/backups/$(date +%Y%m%d)/iptables.rules
sudo cat /etc/cloudflared/config.yml > ~/backups/$(date +%Y%m%d)/cloudflared-config.yml
```
---
## 📌 Appendix

### A. Useful Links

- **Portfolio:** [https://lokal.arahabaki.my.id](https://lokal.arahabaki.my.id/)
- **Grafana:** [https://grafana-k8s.arahabaki.my.id](https://grafana-k8s.arahabaki.my.id/)
- **GitHub Repo:** https://github.com/NrlatiefAdhi/learn-k8s
- **LXD Docs:** [https://linuxcontainers.org/lxd/](https://linuxcontainers.org/lxd/)
- **k3s Docs:** [https://docs.k3s.io/](https://docs.k3s.io/)
- **MetalLB Docs:** [https://metallb.universe.tf/](https://metallb.universe.tf/)
- **Traefik Docs:** [https://doc.traefik.io/traefik/](https://doc.traefik.io/traefik/)

### B. Change Log

| Date       | Change                                            |
| ---------- | ------------------------------------------------- |
| 2026-10-08 | Portfolio deployment live, CI/CD working          |
| 2026-10-08 | Monitoring stack installed (Prometheus + Grafana) |
| 2026-10-09 | LXD + LXDWare installed                           |
| 2026-10-09 | k3s-lxd cluster built (macvlan)                   |
| 2026-10-09 | MetalLB + Traefik in k3s-lxd                      |
| 2026-10-09 | End-to-end ingress test from laptop ✅             |

### C. Future Roadmap

- □  

  GitOps with ArgoCD
- □  

  Multi-environment (staging + production)
- □  

  Sealed Secrets / SOPS
- □  

  Velero backup
- □  

  Loki log aggregation
- □  

  Network monitoring with SNMP
- □  

  Multi-cluster service mesh (Istio/Linkerd)
---
**End of Document**

> Untuk update dokumentasi ini, edit file `homelab-docs.md` dan commit ke repository Git.
> Semua kode dan konfigurasi tersedia di [github.com/NrlatiefAdhi/learn-k8s](https://github.com/NrlatiefAdhi/learn-k8s).
