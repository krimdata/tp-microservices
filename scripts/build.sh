#!/bin/bash
docker build -t localhost:5000/auth-service ./auth-service
docker build -t localhost:5000/product-service ./product-service
docker build -t localhost:5000/order-service ./order-service
docker build -t localhost:5000/api-gateway ./api-gateway
