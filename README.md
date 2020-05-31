# *ALGORITMOS DE GRAFOS*
---
#### Materia: *Análisis y Diseño de Algoritmos*

##### Integrantes:
1. *Andrés Barragán Salas* - *A01026567* - *CSF*
2. *Abraham Garcia Del Corral* - *A01023256* - *CSF*
3. *Gerardo Anglada de Landa* - *A01021917* - *CSF*
4. *Rodrigo Quiroz Reyes* - *A01026546* - *CSF*
5. *Héctor Arturo Quinde García* - *A01339451* - *CSF*

---
## 1. Aspectos generales

Las orientaciones de la tarea se encuentran disponibles en la plataforma **Canvas**.

Este documento es una guía sobre qué información debe entregar como parte del proyecto, qué requerimientos técnicos debe cumplir y la estructura que debe seguir para organizar su entrega.

### 1.1 Requerimientos técnicos

A continuación se mencionan los requerimientos técnicos mínimos del proyecto, favor de tenerlos presente para que cumpla con todos.

* El equipo tiene la libertad de elegir las tecnologías de desarrollo a utilizar en el proyecto, sin embargo, debe tener presente que la solución final se deberá ejecutar en una de las siguientes plataformas en la nube: [Google Cloud Platform](https://cloud.google.com/?hl=es), [Amazon Web Services](https://aws.amazon.com/) o [Microsoft Azure](https://azure.microsoft.com/es-mx/).
* El proyecto deberá utilizar una interfaz Web.
* La arquitectura deberá estar separada claramente por capas (*frontend*, *backend*, *API RESTful*, datos y almacenamiento) según se necesite.
* Todo el código, *datasets* y la documentación del proyecto debe alojarse en este repositorio de GitHub. Favor de mantener la estructura de carpetas propuesta.

### 1.2 Estructura del repositorio

El proyecto debe seguir la siguiente estructura de carpetas, la cual generamos por usted:
```
- / 			        # Raíz de todo el proyecto
    - README.md			# Archivo con los datos del proyecto (este archivo)
    - frontend			# Carpeta con la solución del frontend (Web app)
    - backend			  # Carpeta con la solución del backend (CMS)
    - api			      # Carpeta con la solución de la API
    - datasets		  # Carpeta con los datasets y recursos utilizados (csv, json, audio, videos, entre otros)
    - dbs			      # Carpeta con los modelos, catálogos y scripts necesarios para generar las bases de datos
    - docs			    # Carpeta con la documentación del proyecto
```

### 1.3 Documentación  del proyecto

Como parte de la entrega final del proyecto, se debe incluir la siguiente información:

* Descripción del problema a resolver.
* Diagrama con la arquitectura de la solución.
* Descripción de cada uno de los componentes de la solución.
* Guía de configuración, instalación y despliegue de la solución en la plataforma en la nube seleccionada.
* Documentación de la API. Puede ver un ejemplo en [Swagger](https://swagger.io/). 
* El código debe estar documentado siguiendo los estándares definidos para el lenguaje de programación seleccionado.

## 2. Descripción del proyecto

El problema presentado para el proyecto final involucró la creación de una aplicación para la generación de un grafo y poder ejecutar todos los algoritmos de grafos vistos (DFS, BFS, A*, Prim, Kruskal, Dijkstra, Bellman-Ford y Floyd-Warshall) sobre el mismo. De esta manera, al ejecutar cada uno de los algoritmos de grafos se mostrará una animación, los comandos de ejecución actuales, el código del algoritmo y sus respectivos tiempos de ejecución. Así mismo, la aplicación deberá permitir al usuario importar *datasets* desde un archivo externo para la creación de los grafos o guardar aquellos generados. Por último, varios algoritmos deberán poder ser ejecutados a la vez mediante programación paralela para obtener sus respectivos tiempos de ejecución, ser comparados y generar una gráfica a partir de los resultados obtenidos, cuyos datos podrán ser descargados al igual que la gráfica misma.   
Con respecto a la estructura de la aplicación, esta deberá estar diseñada en una estructura de 3 capas e incluir una interfaz web para la utilización de todas las funcionalidades anteriormente descritas. Para ello, todo el desarrollo de la aplicación finalmente deberá ser desplegado como una aplicación generada con algún servicio de la nube (Google Cloud, AWS o Azure). 


## 3. Solución

A continuación aparecen descritos los diferentes elementos que forman parte de la solución del proyecto.

### 3.1 Arquitectura de la solución

Para comenzar a desarrollar una solución con las características anteriormente descrita se realizó una arquitectura basada en un modelo de 3 capas, en el cual se detallaran los datos y componentes utilizados y las funciones anteriormente descritas. El diagrama es el siguiente: 

![Settings Window](https://github.com/tec-csf/tc2017-pf-primavera-2020-equipo-2-1/blob/master/docs/Estructura_PFAlgoritmos.png)

Al observar la arquitectura anterior el flujo de la información fluye de la siguiente manera. El usuario puede acceder a la interfaz web a través del servicio de hosting elegido, en este caso una aplicación desplegada haciendo uso de *Google Cloud*. Esto permite acceder al usuario a todas las funciones, las cuales son presentadas gracias a un archivo *HTML* en combinación con *CSS*. Dese ahí, en primera instancia, el usuario podrá generar una gráfica, para lo cual se conectará a un archivo de *JavaScript*, el cual se encargará de la generación de la estructura del grafo y de las animaciones de este. Al generar un grafo el usuario también podrá optar por utilizar un archivo *.JSON* existente para cargar la información deseada, al hacerlo, el archivo de *JavaScript* también se encargará de cargar dicha información desde el archivo externo y mostrarla en el interfaz. Una vez echo esto, el usuario podrá navegar por la página para ejecutar los algoritmos de grafos, cuyo funcionamiento serpa ejecutado completamente por el código de *JavaScript*. Por último, el usuario tendrá la posibilidad de realizar una comparación con todos los algoritmos deseados, al hacerlo, se generará una gráfica con los resultados deseados, la cual podrá ser descargada a un archivo *.PDF* externo. También tendrá la opción de acceder a un gráfico con los resultados históricos, al hacerlo, el código de JavaScript se encargará de guardar los resultados actuales y también de obtener otros datos de un archivo *.TXT* o *.CSV* dado.  

### 3.2 Descripción de los componentes

**Hosting:** Para desplegar la aplicación se eligió utilizar el servicio de *Google Cloud* debido a su simplicidad y basta documentación, además de la relativa experiencia de los miembros del equipo utilizando esta herramienta.   
**Interfaz Web:** Para realizar la interfaz web se optó por utilizar los lenguajes *HTML* y *CSS* por lo común que se desarrollar interfaces web en estos lenguajes y la gran cantidad de documentación. De igual manera, su utilizó una pequeña cantidad de JavaScript para animar ciertas partes de la página generada. La interfaz funge la función de un medio para que el usuario pueda seleccionar las funciones de la aplicación, el código *HTML*, mientras que no desempeña ninguna función por si mismo, está encargado de mandar a llamar las funciones dentro del código de *JavaScript* al cual se encuentra ligado.   
**Backend:** Para realizar todas las funciones requeridas para el desarrollo de la aplicación se hizo uso de *JavaScript* por la facilidad que el lenguaje posee para ligarse a un código de *HTML* para manejar la interfaz web y las animaciones solicitadas. De esta manera, dentro del código de *JavaScript* se hace uso de la librería *vis.js* para el desarrollo de gráficas visualmente y su estructura como tal, la librería *highcharts.js* para poder graficar los resultados obtenidos a partir de los algoritmos y la librería *parallel.js* para la paralelización de ciertas secciones del código. En este código de JavaScript se incluyen todos los algoritmos de grafos solicitados.  
**Archivos Externos:** Para el acceso y almacenamiento de información desde la página generada se optó por archivos de tipo *.TXT*, *.JSON*, *.CSV* y *.PDF*, esto por la facilidad que los mismo proveen tanto para la lectura como para la escritura de información dentro de los mismos, así como la facilidad del acceso a ellos desde un código de *JavaScript*.  

### 3.3 Frontend

El *Frontend* de la aplicación generada involucró una interfaz web, dentro de la cual, mediante un menú lateral el usuario podría navegar a través de las secciones de la aplicación con facilidad. Cada sección de la pagina funciona primordialmente con contenedores *<div>*, ingresos de información *<input>* y botones *<button>*, cada uno con respectivos identificadores *id* para la comunicación continua con el código de *JavaScript*.  

#### 3.3.1 Lenguaje de programación

Los lenguajes de programación utilizados principalmente para el desarrollo del *Frontend* fueron *HTML* para la estructura general de la interfaz, *CSS* para la personalización y diseño de la interfaz y una pequeña sección de *JavaScript* para animaciones sutiles de la página como el menú lateral.  

#### 3.3.2 Framework

Como tal no se hizo uso de ningún Framework para el desarrollo de la interfaz web. A pesar de ello, se hizo uso de *templates* ofrecidos para el desarrollo rápido de la página. El *template* de código de *HTML* utilizado contaba de la misma manera con código de *CSS* que nos facilitó la personalización de la interfaz.  

#### 3.3.3 Librerías de funciones o dependencias

Como fue mencionado anteriormente, *templates* para el desarrollo de la interfaz web fueron utilizados, lo cual únicamente representó el uso de las librerías para códigos de *CSS* que se encontraban incluidos en el mismo, dicha información fue adquirida de la página *w3schools*. De esta manera se hizo uso de las siguientes ligas:  

        https://www.w3schools.com/w3css/tryw3css_templates_interior_design.htm#  
	    https://www.w3schools.com/w3css/4/w3.css   
        https://fonts.googleapis.com/css?family=Poppins    
	    https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css  

### 3.4 Backend

El *Backend* fue programada haciendo uso de *JavaScript* en él, se genera la estructura del grafo y sus respectivas visualización u animaciones, además, a partir de su estructura se ejecutan cada uno de los algoritmos de grafos (DFS, BFS, A*, Prim, Kruskal, Dijkstra, Bellman-Ford y Floyd-Warshall). Para cada uno de los algoritmos, además de ejecutar el algoritmo como es usualmente conocido, se realizan distintas funciones como ejecutar las animaciones del grafo, contabilizar el tiempo de ejecución, mostrar el código del algoritmo y su línea actual de ejecución y por último cada uno de estos toma una variable para ser ejecutados con distintas velocidades a elegir por el usuario. Es importante notar que para cada uno de los algoritmos se realiza una copia del grafo a fin de que las animaciones que se están mostrando en una sección de la interfaz no interfiera con alguna otra. Para la función de comparar los algoritmos, el código manda a llamar a todas las funciones que el usuario seleccione simultáneamente, y gracias a que *JavaScript* es un lenguaje de programación que se ejecuta de manera asíncrona, todas estas llamadas se ejecutarán al mismo tiempo. Finalmente, el código de *JavaScript* también se hace cargo de generar gráficas a partir de los resultados generados, almacenar la información obtenida y también cargar información a partir de distintos archivos. Para la conexión y comunicación continua el código hace uso de los *id*s establecidos en el código de *HTML* para obtener y mandar información hacia la interfaz para su correcta visualización.  

#### 3.4.1 Lenguaje de programación

Como fue mencionado anteriormente, le lenguaje de programación utilizado para el *backend* fue *JavaScript* debido a las librerías que tiene el lenguaje para animaciones y por su fácil conexión con un código de *HTML*.  

#### 3.4.2 Framework

El *framework* de desarrollo utilizado fue en parte *Node.js*, ya que en él están basadas las liberías utilizadas (*vis.js*) y requieren del mismo para su funcionamiento.   

#### 3.4.3 Librerías de funciones o dependencias

Para el desarrollo de las funciones solicitadas por la aplicación se utilizaron 4 librerías: *vis.js*, utilizada para la estructura de los grafos, su visualización y animación; *JQuery*, utilizado para la lectura de y organización de la información obtenida de modo que esta pudiera ser graficada; *highcharts.js* para poder graficar los resultados obtenidos; y *parallel.js* para poder paralelizar ciertas secciones del código (a pesar de que en muchas ocasiones esto no era posible debido a la naturaleza propia de *JavaScript*).  

        https://visjs.org/  
	    https://qunitjs.com/  
	    https://www.highcharts.com/  
	    https://parallel.js.org/  


### 3.5 API

*[Incluya aquí una explicación de la solución utilizada para implementar la API del proyecto. No olvide incluir las ligas o referencias donde se puede encontrar información de los lenguajes de programación, frameworks y librerías utilizadas.]*

#### 3.5.1 Lenguaje de programación
#### 3.5.2 Framework
#### 3.5.3 Librerías de funciones o dependencias

*[Incluya aquí una explicación de cada uno de los endpoints que forman parte de la API. Cada endpoint debe estar correctamente documentado.]*

*[Por cada endpoint debe incluir lo siguiente:]*

* **Descripción**:
* **URL**:
* **Verbos HTTP**:
* **Headers**:
* **Formato JSON del cuerpo de la solicitud**: 
* **Formato JSON de la respuesta**:


## 3.6 Pasos a seguir para utilizar el proyecto

*[Incluya aquí una guía paso a paso para poder utilizar el proyecto, desde la clonación de este repositorio hasta el despliegue de la solución en una plataforma en la nube.]*

## 4. Referencias

*[Incluya aquí las referencias a sitios de interés, datasets y cualquier otra información que haya utilizado para realizar el proyecto y que le puedan ser de utilidad a otras personas que quieran usarlo como referencia]*
