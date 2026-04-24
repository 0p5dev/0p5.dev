set shell := ["/usr/bin/env", "bash", "-c"]

default: up

up:
    docker compose up webapp

down:
    docker compose down webapp --rmi local --remove-orphans

build:
    npm run build

ar-push: build-docker tag push

build-docker:
    docker build -t 0p5.dev:dev -f Dockerfile .

run-docker:
    docker run -it --rm --name 0p5.dev -p 3000:3000 0p5.dev:dev

tag:
    docker tag 0p5.dev:dev us-central1-docker.pkg.dev/local-first-476300/open-source-application-images/0p5.dev:dev

push:
    docker push us-central1-docker.pkg.dev/local-first-476300/open-source-application-images/0p5.dev:dev

add PACKAGE *FLAGS:
    npm install {{FLAGS}} {{PACKAGE}}

cleanup:
    npm run cleanup
