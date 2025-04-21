### You cannot manually runs the dockerfile for web app because when we are building or next app then we have to give it a access of database and here comes the network problem because that next app doesnot understands the localhost of another container and he thinks that the localhost is his owns containers address

### Thats why we need docker-compose 

### But in docker-compose there is still problem for the network thing thats why i this structure

### 1st time:
```sh
bun install
docker network create testing
docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=me --network testing postgres
cd .\packages\db\
bunx prisma migrate dev
cd ../../   
cd .\apps\web\
bun run build # i a  building my next app first then copies the .next folder in the docker, you can see it from Dockerfile.web
cd ../../   
docker-compose up --build
```

### From the next times:
```sh
cd .\apps\web\
bun run build 
cd ../../   
docker-compose up --build
```

### read the structure.md file from explanation if you are confused

---
---
---

### if you want to just start everything using dockerfile then do this steps:

```sh
bun install
docker network create testing
docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=me --network testing postgres
cd .\packages\db\
bunx prisma migrate dev
cd ../../   

docker build -t backend -f ./docker/Dockerfile.backend .
docker run -d -p 8080:8080 --network testing -e DATABASE_URL=postgres://postgres:me@postgres:5432  backend


docker build -t ws -f ./docker/Dockerfile.ws .
docker run -d -p 8081:8081  --network testing -e DATABASE_URL=postgres://postgres:me@postgres:5432 ws

cd .\apps\web\
bun run build 
cd ../../  
docker build --build-arg DATABASE_URL=postgres://postgres:me@postgres:5432 -t web -f ./docker/Dockerfile.web .
docker run -d -p 3000:3000 --network testing web

```


### For deployment on AWS do this setups:

```sh
bun install
cd .\packages\db\
# get a database from neondb
bunx prisma migrate dev
cd ../../  

cd .\apps\web\
bun run build 
cd ../../  

git add .
git commit -m "comment"
git push origin main
```