FROM clojure:latest 

WORKDIR /usr/app

COPY . .

RUN lein deps


RUN mv "$(lein uberjar | sed -n 's/^Created \(.*standalone\.jar\)/\1/p')" app-standalone.jar
CMD ["java", "-jar", "app-standalone.jar"]