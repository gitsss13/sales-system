# Sales System v1

This is the first version of the Sales System application.

Features:
- Add sales
- Record sale item, quantity, and price
- View sales in a table
- Show total sales count
- Calculate revenue

## Run locally

npm install
npm start

Open: http://localhost:8080

## Docker

docker build -t gitsss13/sales-system:v1 .

docker run -p 8080:8080 gitsss13/sales-system:v1

## Kubernetes

kubectl apply -f k8s/sales-v1-deployment.yaml

Then access via http://localhost:30081
