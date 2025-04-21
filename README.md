### You cannot manually runs the dockerfile for web app because when we are building our next app then we have to give it a access of database and here comes the network problem because that next app doesnot understands the localhost of another container and he thinks that the localhost is his owns containers address

### Thats why we need a external database from neondb

### if you want to just start everything using dockerfile then do this steps:

```sh
bun install
cd .\packages\db\
bunx prisma migrate dev
cd ../../   

docker build -t backend -f ./docker/Dockerfile.backend .
docker run -d -p 8080:8080 --env-file ./packages/db/.env backend

docker build -t ws -f ./docker/Dockerfile.ws .
docker run -d -p 8081:8081 --env-file ./packages/db/.env ws

docker build --env-file ./packages/db/.env -t web -f ./docker/Dockerfile.web .
docker run -d -p 3000:3000 web

```

---

### if you want to just start everything using docker-compose then do this steps:

### 1st time:
```sh
bun install
cd .\packages\db\
# get a postgres database from neondb, and paste that neondb database url on .env file
# you cant start a local database in this project because of the network problem
bunx prisma migrate dev
cd ../../   
docker-compose --env-file ./packages/db/.env up --build
```

### From the next times:
```sh
docker-compose --env-file ./packages/db/.env up --build
```

---

### For deployment on AWS do this setups:

```sh
bun install
cd .\packages\db\
# get a database from neondb
bunx prisma migrate dev
cd ../../  

git add .
git commit -m "comment"
git push origin main
```

# read the structure.md file from explanation if you are confused