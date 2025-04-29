#!/bin/bash
docker push localhost:5000/auth-service
docker push localhost:5000/product-service
docker push localhost:5000/order-service
docker push localhost:5000/api-gateway
