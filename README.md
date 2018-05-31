# USC Operator Lookup 

A simplistic and efficient phone lookup for university operators.

All data was pulled from the original CSC OpManual. 

Written using AngularJS and ElasticSearch for fast and flexibile lookups.
The website is hosted using nginx for efficiency and security.

* Step 1- Start ES Server

	* cd &lt; REPOSITORY &gt;

	* docker run -d -p 9200:9200 -p 9300:9300 --name docker_elasticsearch -e CLUSTER=usc_operator itzg/elasticsearch:1.3

* Step 2- Build the indexer container

	* cd PythonIndexer/py

	* docker build -t hongalex/python_indexer .

* Step 3- Run the container (index the files)

	* docker run --link docker_elasticsearch:es_server hongalex/python_indexer

* Step 4- Build the web application

	* cd ../../AngularWebApp

	* docker build -t hongalex/usc_operator .

* Step 5- Run the web server container

	* docker run -d -p 80:80 --link docker_elasticsearch:es_server hongalex/usc_operator




#####Written by Alex Hong