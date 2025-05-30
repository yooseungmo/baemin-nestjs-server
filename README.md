<p align="left">
  <img src="https://skillicons.dev/icons?i=aws,kubernetes,terraform,nestjs,rabbitmq,redis,postgres,mongodb" alt="Tech Stack" />
</p>

# Baemin-NestJS-Server

---

> 이 프로젝트는 **배달의 민족**을 예제로 구현한 **NestJS** 기반 **MSA** 백엔드 시스템입니다.  
> DDD, CQRS/SAGA, Event-Driven Architecture, gRPC, Kubernetes, Terraform, CI/CD, 모니터링까지  
> 실제 운영 수준의 **마이크로서비스 아키텍처**를 단계적으로 설계 및 구현했습니다.

---

## 주요 기능 (Key Features)

1. **MSA 아키텍처**

   - Monorepo 기반 NestJS 마이크로서비스
   - Polyrepo + DDD(도메인 주도 설계) 전환

2. **고급 아키텍처 & 패턴**

   - Hexagonal & Clean Architecture
   - CQRS 패턴 (Command/Query 분리)
   - SAGA 패턴 (분산 트랜잭션 관리)
   - Event Sourcing(이벤트 소싱)

3. **마이크로서비스 구현**

   - User, Product, Order, Payment, Notification 마이크로서비스
   - API Gateway 모듈 (REST & gRPC)

4. **통신 & 메시징**

   - HTTP, TCP, gRPC 통신 지원
   - Redis Pub/Sub, RabbitMQ 메시징

5. **컨테이너화 & 오케스트레이션**

   - Dockerfile 최적화
   - Kubernetes: Pod, Deployment, Service, Namespace, PVC 등
   - Helm 차트로 배포 자동화

6. **Service Mesh & 인프라 IaC**

   - Istio 기반 트래픽 관리
   - Terraform으로 AWS 인프라 프로비저닝

7. **CI/CD & 배포**

   - GitHub Actions 워크플로우
   - AWS(EKS, ECR, S3, RDS, ElastiCache, Amazon MQ) 활용

8. **로깅 & 모니터링**

   - EFK(Elasticsearch, Fluentbit, Kibana)
   - Prometheus & Grafana 메트릭 시각화

9. **인증 & 권한 관리**
   - JWT 기반 인증, 세션 인증
   - Role-Based Access Control

---

## 기술 스택 (Tech Stack)

| 분야                | 상세 내용                                             |
| ------------------- | ----------------------------------------------------- |
| **Framework**       | NestJS                                                |
| **Language**        | TypeScript                                            |
| **Database**        | PostgreSQL (TypeORM), MongoDB (mongoose)              |
| **Messaging**       | RabbitMQ, Redis Pub/Sub                               |
| **API Gateway**     | NestJS Gateway, gRPC                                  |
| **Container & K8s** | Docker, Kubernetes, Helm                              |
| **Infra IaC**       | Terraform, Istio                                      |
| **Monitoring**      | Prometheus, Grafana, Elasticsearch, Fluentbit, Kibana |
| **CI/CD**           | GitHub Actions                                        |
| **Auth & RBAC**     | JWT, Session, Role-Based Access Control               |

---

## 프로젝트 구조 (Project Structure)

```plaintext
baemin-nestjs-server
├── apps
│   ├── gateway-api           # API Gateway (REST & gRPC)
│   ├── user-service          # User 마이크로서비스
│   ├── product-service       # Product 마이크로서비스
│   ├── order-service         # Order 마이크로서비스
│   ├── payment-service       # Payment 마이크로서비스
│   └── notification-service  # Notification 마이크로서비스
├── libs
│   └── common                # 공통 유틸, 인터셉터, 필터, 데코레이터
├── proto                     # Protobuf 정의 파일
├── charts                    # Helm 차트
│   └── delivery-msa-chart
├── terraform                 # Terraform 설정 파일
├── docker-compose.yml        # 로컬 의존성 (PostgreSQL, Redis, RabbitMQ 등)
├── build-and-push.sh         # CI 빌드 & 푸시 스크립트
└── .github
    └── workflows             # GitHub Actions 워크플로우
```

---

## AWS 아키텍처 (AWS Architecture)

![image](https://github.com/user-attachments/assets/d7396d39-044b-4782-bf04-efe97ef8a5a1)

### 설명

1. Route 53: DNS & 트래픽 라우팅
2. ELB/ALB: 트래픽 분산
3. EKS: Kubernetes 클러스터 운영
4. ECR: 컨테이너 이미지 레포지토리
5. RDS: PostgreSQL
6. ElastiCache: Redis 캐싱
7. Amazon MQ: RabbitMQ 관리형 서비스
8. S3: 정적 자산 저장
9. CloudWatch & Prometheus/Grafana: 로그 & 메트릭 모니터링
10. Elasticsearch & Kibana: 로그 분석

---

## 설치 및 실행 (Installation & Usage)

### Requirements

- **Node.js** (v20+)
- **Docker** & **Docker Compose**
- **AWS CLI**

### Steps

1. **프로젝트 클론**

   ```bash
   git clone https://github.com/yooseungmo/baemin-nestjs-server.git
   cd baemin-nestjs-server
   ```

2. **의존성 설치 & 로컬 서비스 실행**

   ```bash
   npm install
   docker-compose up -d    # PostgreSQL, Redis, RabbitMQ 등
   ```

3. **개발 서버 실행**
   ```bash
   npm run start:dev
   ```

---

## 라이선스 (License)

이 프로젝트는 [MIT License](./LICENSE)에 따라 자유롭게 사용 가능합니다.

---
