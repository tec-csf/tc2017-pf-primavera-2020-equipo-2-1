/* ---- VARIABLES GLOBALES ---- */
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var network = null;
var dataGraph=[];
var categories_graph=[];

var node_number, edge_number;
var edges_array = [];
var Aristas=[];

/* ---- ALGORITMOS PARA LA CREACIÓN DE GRAFO ---- */

/* Limpia todos los valores del grafo */
function destroy() {
    if (network !== null) {
        nodes.clear();
        edges.clear();
        network.destroy();
        network = null;
        Aristas = [];
    }
}


/* Función auxiliar de drawGraph que agrega al DataSet el nodo */
function addNode(id) {
    var id_shown = id.toString();
    nodes.add({id: id, label: id_shown});
}


/* Función auxiliar de drawGraph que agrega al DataSet la arista */
function addEdge(id, origin, destination, weight) {
    if (!isNeighbour(origin, destination)) {
        var shown_weight = weight.toString();
        edges.add({id: id, from: origin, to: destination, label: shown_weight, arrows: 'to', color: {color: "#2B7CE9", inherit: false}});
        edges_array.push({id: id, from: origin, to: destination, weight: weight});
        var Arista = {
            origen: origin,
            destino: destination,
            peso: weight,
            ID: id

        };
        Aristas.push(Arista);
        return 0;
    }
    return -1;
}


/* Genera grafo */
function drawGraph(no_nodes, no_edges) {
    edges_array.length=0;
    destroy();

    node_number = no_nodes;
    edge_number = no_edges;

    for (var i = 1; i <= no_nodes; ++i) {
        addNode(i);
    }

    for (var i = 1; i <= no_edges; ++i) {
        var origin = Math.floor(Math.random() * no_nodes) + 1;
        var destination = Math.floor(Math.random() * no_nodes) + 1;
        var weight = Math.floor(Math.random() * 15) + 1;

        if (destination === origin) {
            destination++;
        }
        i += addEdge(i, origin, destination, weight);
    }

    var container = document.getElementById('mynetwork');

    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = { };

    // Inicializa Network
    network = new vis.Network(container, data, options);
}


/* Genera datos aleatorios para creación de grafo */
function drawRandomGraph() {
    edges_array.length=0;
    // Genera entre 5 y 15 nodos,
    // y entre los n nodos generados y 2*n nodos generados de aristas
    var no_nodes = Math.floor(Math.random() * 11) + 5;
    var no_edges = Math.floor(Math.random() * (no_nodes+1)) + no_nodes;

    // Despliega los números generados en HTML
    document.getElementById("node-set").value = no_nodes;
    document.getElementById("edge-set").value = no_edges;

    drawGraph(no_nodes, no_edges);
}

/* Obtiene datos declarados en HTML para creación de grafo */
function drawSetGraph() {
    var nodes_set = document.getElementById("node-set").value;
    var edges_set = document.getElementById("edge-set").value;

    drawGraph(nodes_set, edges_set);
}


/* Genera un grafo fijo para debug */
function drawTestGraph() {
    edges_array.length=0;
    destroy();

    node_number = 7;
    edge_number = 10;
    var no_nodes = node_number;
    var no_edges = edge_number;

    // Despliega los números generados en HTML
    document.getElementById("node-set").value = no_nodes;
    document.getElementById("edge-set").value = no_edges;

    var i;
    for (i = 1; i <= no_nodes; ++i) {
        addNode(i);
    }

    i = 1;
    var origin = 1;
    var destination = 2;
    var weight = 3;
    i += addEdge(i, origin, destination, weight);

    i = 2;
    origin = 1;
    destination = 5;
    weight = 9;
    i+=addEdge(i, origin, destination, weight);

    i = 3;
    origin = 1;
    destination = 3;
    weight = 8;
    i += addEdge(i, origin, destination, weight);

    i = 4;
    origin = 1;
    destination = 7;
    weight = 5;
    i += addEdge(i, origin, destination, weight);

    i = 5;
    origin = 2;
    destination = 2;
    weight = 2;
    i += addEdge(i, origin, destination, weight);

    i = 6;
    origin = 3;
    destination = 5;
    weight = 10;
    i += addEdge(i, origin, destination, weight);

    i = 7;
    origin = 3;
    destination = 7;
    weight = 10;
    i+=addEdge(i, origin, destination, weight);

    i = 8;
    origin = 4;
    destination = 1;
    weight = 11;
    i+=addEdge(i, origin, destination, weight);

    i = 9;
    origin = 6;
    destination = 3;
    weight = 7;
    i+=addEdge(i, origin, destination, weight);

    i = 10;
    origin = 7;
    destination = 4;
    weight = 8;
    i+=addEdge(i, origin, destination, weight);

    var container = document.getElementById('mynetwork');
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        //nodes: {shape: "circle"}
    };

    // Inicializar Network
    network = new vis.Network(container, data, options);
}


/* ---- ESTILIZACIÓN ---- */

/* Sombrea nodo; denota que ha sido visitado
 * pero aún no ha sido analizado
 */
function highlightNode(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {background: '#5284AF'}});
}


/* Marca las aristas que han sido recorridas */
function highlightEdge(id, edge_group, node_group, network_group, node_Id) {
    edge_group.update({id: id, width: 3, color: {color: "red"}});
    if(node_Id !== undefined)
    {
      var connected_nodes = network_group.getConnectedNodes(node_Id, 'to');
      var i;
      for(i = 0; i < connected_nodes.length; i++) {
        highlightNode(connected_nodes[i], node_group);
      }
    }
}


/* Rodea nodo con línea punteada;
 * denota que ese nodo es inaccesible
 */
function dashNode(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {border: "red"}, shapeProperties: {borderDashes: [5, 5]}});
}


/* Marca arista con línea punteada;
 * denota que esa arista no se recorre
 */
function dashEdge(id, edge_group) {
    edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: [5, 5]});
}


/* Rodea nodo con línea roja y enfatiza número;
 * denota que ese nodo ha sido analizado
 */
function markVisited_Node(id, node_group) {
  node_group.update({id: id, borderWidth: 3, color: {border: "red", background: '#5284AF'}, font: {color: '#FEFEFE'}});
}


/* Función con atraso para marcar nodo como analizado */
function visit_Node(node_analized, node_group, delay)
{
  return new Promise(resolve => {
    setTimeout(() => {
      markVisited_Node(node_analized, node_group);
      resolve(true);
    }, delay * 1.5);
  });
}

/* Regresa nodo a valores preestablecidos */
function resetAnimation_Node(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {border: "#2B7CE9", background: ''}, font: {color: 'black'}});
}


/* Regresa arista a valores preestablecidos */
function resetAnimation_Edge(id, edge_group) {
    edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: false})
}


/* Para quitarle todos los highlights a grafo */
function cleanGraph(node_group, edge_group){
  for( var i = 0; i < node_group.length; i++){
    resetAnimation_Node(i+1, node_group);
  }
  for(var i = 0; i < edge_group.length; i++){
    resetAnimation_Edge(i+1, edge_group);
  }
}

/* Animar barras de avance */
function load_progressBar(algorithm, progress) {
  var bar_id = "bar-" + algorithm;

    var progress_bar = document.getElementById(bar_id);
    progress_bar.innerHTML = "";
    var width = parseInt(progress_bar.style.width.substring(0, progress_bar.style.width.length - 1));
    var id = setInterval(frame, 2);
    function frame() {
      if (width >= progress) {
        clearInterval(id);
      } else {
        width++;
        progress_bar.style.width = width + "%";
        if (width >= 20)
            progress_bar.innerHTML = width  + "%";
      }
    }
}

/* ---- ACCESO ---- */

/* Verifica si dos nodos están conectados directamente */
function isNeighbour(origin, destination) {
    for(let i=1; i <= edges.length; ++i)
        if (edges.get(i).from == origin)
            if (edges.get(i).to == destination)
                return true;
    return false;
}


/* ---- OTROS ---- */

/* Estructura para utilizar un contendor queue */
function Queue(){
  var a=[], b=0;
  this.getLength = function() { return a.length-b };
  this.isEmpty = function() { return 0==a.length };
  this.enqueue = function(b) { a.push(b) };
  this.dequeue = function() {
    if(0!=a.length){
      var c=a[b];
      2*++b>=a.length&&(a=a.slice(b),b=0);
      return c
    }
  };
  this.peek=function() { return 0<a.length?a[b]:void 0 }
};


/* Crea un atraso de tiempo establecido
 * para mejor visualización de recorrido
 */
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(true); }, ms);
  });
}


/* -------------------------------------------------------------------------- */
/* ------------------------------- ALGORITMOS ------------------------------- */

// Hace falta meter la medición de tiempo (desde el .js);

/* ---- DFS ---- */ // Gerry
function DFS(delay) {
    // Algoritmo para desplegar en HTML
    var dfs_code = "";
    dfs_code += "var stack = [];<br>";
    dfs_code += "stack.push(nodo_inicial);<br>";
    dfs_code += "while stack NOT EMPTY<br>";
    dfs_code += "&emsp;current_node = stack.pop();<br>";
    dfs_code += "&emsp;if current_node NOT VISITED;<br>";
    dfs_code += "&emsp;&emsp;current_node = VISITED;<br>";
    dfs_code += "&emsp;&emsp;for i in all adyacent_edges(current_node)<br>";
    dfs_code += "&emsp;&emsp;&emsp;stack.push(i)";

    document.getElementById("dfs-code").innerHTML = dfs_code;

    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var dfs_nodes = new vis.DataSet(nodes.get());
    var dfs_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('dfs-network'); // ids se encuentran en main.html.
    var data = {
        nodes: dfs_nodes,
        edges: dfs_edges
    };
    var options = {};
    var dfs_network = new vis.Network(container, data, options);
    // Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    // Se obtiene el nodo de origen usando el id del input en html
    var start_node = parseInt(document.getElementById("origin-dfs").value);

// Se 'imprime' instrucción en ejecución
document.getElementById("dfs-instruction").innerHTML = "DFS("+start_node+");";

    var time = DFSUtil(start_node, dfs_network, dfs_nodes, dfs_edges, delay);
    return time;
}


async function DFSUtil(start_node, dfs_network, dfs_nodes, dfs_edges, delay)
{
    var ti = performance.now();

    var dfs_result = ""; // String con recorrido de algoritmo.
    document.getElementById("dfs-result").innerHTML = dfs_result;

    var visited = [];
    for (var i = 0; i < node_number; ++i)
        visited[i] = false;

    var stack = [];
    stack.push(start_node);

document.getElementById("dfs-instruction").innerHTML = "stack.push["+start_node+"];";

    highlightNode(start_node, dfs_nodes);
    while (stack.length > 0)
    {
        var node_analized = stack.pop();
        if(!visited[node_analized - 1])
        {
            await visit_Node(node_analized, dfs_nodes, delay);

            dfs_result += node_analized;
            document.getElementById("dfs-result").innerHTML = dfs_result;
            dfs_result += " -> ";

            visited[node_analized - 1] = true;

            var neighbors = dfs_network.getConnectedEdges(node_analized);

document.getElementById("dfs-instruction").innerHTML = "while stack NOT EMPTY<br>&emsp;current_node = stack.pop();<br>&emsp;if current_node NOT VISITED;<br>&emsp;&emsp;current_node = VISITED;<br>";;
await sleep(delay * 1.5);

            for (var i = 0; i < neighbors.length; ++i)
            {
                if (dfs_edges.get(neighbors[i]).from == node_analized)
                {
                    var destination = dfs_edges.get(neighbors[i]).to;

document.getElementById("dfs-instruction").innerHTML = "&emsp;&emsp;for i in all adyacent_edges(current_node)<br>&emsp;&emsp;&emsp;stack.push(i)";

                    stack.push(destination);
                    highlightEdge(neighbors[i], dfs_edges, dfs_nodes, dfs_network, node_analized);
                }
            }
        }
    }
document.getElementById("dfs-instruction").innerHTML = "END";

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-dfs").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
    return execution_time;
}



/* ---- BFS ---- */ // Gerry
function BFS(delay)
{
    // Algoritmo para desplegar en HTML
    var bfs_code = "";
    bfs_code += "var queue = new Queue();<br>";
    bfs_code += "nodo_inicial = VISITED;<br>";
    bfs_code += "queue.enqueue(nodo_inicial);<br>";
    bfs_code += "while queue NOT EMPTY<br>";
    bfs_code += "&emsp;current_node = queue.dequeue();<br>";
    bfs_code += "&emsp;for i in all adyacent_edges(current_node)<br>";
    bfs_code += "&emsp;&emsp;if i NOT VISITED<br>";
    bfs_code += "&emsp;&emsp;&emsp;i = VISITED;<br>";
    bfs_code += "&emsp;&emsp;&emsp;queue.enqueue(i);<br>";

    document.getElementById("bfs-code").innerHTML = bfs_code;

    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var bfs_nodes = new vis.DataSet(nodes.get()); // Se hace una copia de los nodos y aristas
    var bfs_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('bfs-network'); // Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: bfs_nodes,
        edges: bfs_edges
    };
    var options = { };
    var bfs_network = new vis.Network(container, data, options);
    // Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    // Se obtiene el nodo de origen usansdo el id del input en html
    var start_node = parseInt(document.getElementById("origin-bfs").value);

// Se 'imprime' instruccion en ejecución
document.getElementById("bfs-instruction").innerHTML = "BFS("+start_node+");";

    var time = BFSUtil(start_node, bfs_network, bfs_nodes, bfs_edges, delay);
    return time;
}


async function BFSUtil(start_node, bfs_network, bfs_nodes, bfs_edges, delay)
{
    var ti = performance.now();

    var bfs_result = ""; // String con recorrido de algoritmo.
    document.getElementById("bfs-result").innerHTML = bfs_result;

    var visited = [];
    for (var i = 0; i < node_number; i++)
        visited[i] = false;

    var queue = new Queue();
    highlightNode(start_node, bfs_nodes);

    visited[start_node - 1] = true;

    queue.enqueue(start_node);

document.getElementById("bfs-instruction").innerHTML = "var queue = new Queue();<br>nodo_inicial = VISITED;<br>queue.enqueue(nodo_inicial);<br>";

    while (!queue.isEmpty())
    {
        var node_analized = queue.dequeue();
        await visit_Node(node_analized, bfs_nodes, delay);

        bfs_result += node_analized;
        document.getElementById("bfs-result").innerHTML = bfs_result;
        bfs_result += " -> ";

        visited[node_analized - 1] = true;

        var neighbors = bfs_network.getConnectedEdges(node_analized);

document.getElementById("bfs-instruction").innerHTML = "while queue NOT EMPTY<br>&emsp;current_node = queue.dequeue();<br>";
await sleep(delay);

        for (var i = 0; i < neighbors.length; i++)
        {
            if (bfs_edges.get(neighbors[i]).from == node_analized)
            {
                var destination = bfs_edges.get(neighbors[i]).to;
                if(!visited[destination - 1])
                {

document.getElementById("bfs-instruction").innerHTML = "&emsp;for i in all adyacent_edges(current_node)<br>&emsp;&emsp;if i NOT VISITED<br>&emsp;&emsp;&emsp;i = VISITED;<br>&emsp;&emsp;&emsp;queue.enqueue(i);<br>";

                    highlightEdge(neighbors[i], bfs_edges, bfs_nodes, bfs_network, node_analized);
                    queue.enqueue(destination);
                    visited[destination - 1] = true;
                }
            }
        }
    }
document.getElementById("bfs-instruction").innerHTML = "END";

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-bfs").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    return execution_time;
}


/* ---- A* ---- */ // Quiroz
var a_result;
function A_star(delay){

    // Algoritmo para desplegar en HTML
    var a_code = "";
    a_code += "var openSet = [];<br>";
    a_code += "openSet.push(nodo_inicial);<br>";
    a_code += "var gScore [] = INFINITY;<br>";
    a_code += "gScore[nodo_inicial]=0;<br>";
    a_code += "var fScore [] INFINITY= ;<br>";
    a_code += "fScore[nodo_inicial]=h(nodo_inicial);<br>";
    a_code += "var closeSet = [];<br>";
    a_code += "var camefrom = [];<br>";

    a_code += "while openSet IS NOT EMPTY<br>";
    a_code += "&emsp;current = lowest_f(openSet);<br>";

    a_code += "&emsp;if current IS nodo_final;<br>";
    a_code += "&emsp;&emsp;return camefrom;<br>";
    a_code += "&emsp;openSet.remove(current);<br>";
    a_code += "&emsp;for i in all neighbor(current)<br>";
    a_code += "&emsp;&emsp;new_gScore = gScore[current] + d(current, neighbor)<br>";
    a_code += "&emsp;&emsp;if new_gScore < gScore[neighbor]<br>";
    a_code += "&emsp;&emsp;&emsp;cameFrom[neighbor] = current<br>";
    a_code += "&emsp;&emsp;&emsp;gScore[neighbor] = new_gScore<br>";
    a_code += "&emsp;&emsp;&emsp;fScore[neighbor] = gScore[neighbor] + h(neighbor)<br>";
    a_code += "&emsp;&emsp;&emsp;cameFrom[neighbor] = current<br>";
    a_code += "&emsp;&emsp;&emsp;if neighbor IS NOT in openSet<br>";
    a_code += "&emsp;&emsp;&emsp;&emsp;openSet.add(neighbor)<br>";
    a_code += "return UNREACHABLE<br>";

    document.getElementById("a-code").innerHTML = a_code;
    a_result = ""; // Limpia string

    // Se obtiene el nodo de origen usando el id del input
    // ids se encuentran en main.html. (todos son 'origin-algoritmo')
    var start_node = parseInt(document.getElementById("origin-a").value);
    var end_node = parseInt(document.getElementById("end-a").value);

    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var a_nodes = new vis.DataSet(nodes.get());
    var a_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('a-network'); // ids se encuentran en main.html.
    var data = {
        nodes: a_nodes,
        edges: a_edges
    };
    var options = {};
    var a_network = new vis.Network(container, data, options);
    // Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    var gScore=[node_number-1]
    for(var i=0;i<node_number;i++){
      gScore[i]=Infinity;
    }
    var fScore=[node_number-1]
    for(var i=0;i<node_number;i++){
      fScore[i]=Infinity;
    }


    // Se 'imprime' instrucción en ejecución
    document.getElementById("a-instruction").innerHTML = "A("+start_node+");";

    var time = AUtil(start_node, a_network, a_nodes, a_edges,gScore,fScore,end_node,delay);
    return time;
}

var current_weight;

async function AUtil(start_node, a_network, a_nodes, a_edges, gScore,fScore,end_node,delay) {

     var ti = performance.now(); // Obtención de tiempos ejecucion; NO TOCAR

     var open_set = [];
     var close_set= [];
     var came_from =[];
     var getpath =[];
     var heuristics=h(start_node,end_node,a_network);
     open_set.push(start_node);
     gScore[start_node]=0;
     fScore[start_node]=heuristics;

     var zero=0;

     getpath.push({now:start_node,from:zero});

     while(open_set.length>0){
      var winner =0;
      for (var i=0;i<open_set.length;++i){
          if(fScore[i]<fScore[winner]){
              winner =i;
          }
      }
      var current = open_set[winner];
      var neighbors = a_network.getConnectedNodes(current);
      var edge_neighbors = a_network.getConnectedEdges(current);


      if(current==end_node){
          came_from.push(current);
          const visit_Node_bool = await visit_Node(current, a_nodes, delay);

          highlightNode(current, a_nodes);

          a_result+=current;
          a_result+="<br>"
          document.getElementById("a-result").innerHTML = a_result;

          draw_path(start_node,end_node,getpath)
          return 0;
      }

      remove_from_array(open_set,current)
      close_set.push(current);

      for(i = 0; i < neighbors.length; i++){

          var neighbor = neighbors[i];

          check_dir(current,neighbor);


          if(direction){
              highlightNode(current, a_nodes);
          if (!close_set.includes(neighbor)) {
            get_weight(current,neighbor)
              var tempG = gScore[current]+ current_weight;

              // Is this a better path than before?
              var newPath = false;
              if (open_set.includes(neighbor)) {
                if (tempG < gScore[neighbor]) {
                  gScore[neighbor] = tempG;
                  newPath = true;
                }
              } else {
                gScore[neighbor] = tempG;
                newPath = true;
                open_set.push(neighbor);

              }
              if (newPath) {
                  //console.log("Debug");
                fScore[neighbor]=tempG;


                const visit_Node_bool = await visit_Node(current, a_nodes, delay);

                check_dir(neighbor,current);
                 if(!direction){
                    highlightEdge(edge_neighbors[i], a_edges, a_nodes, a_network,current);
                 }
                 getpath.push({now:neighbor,from:current});

                  fScore[neighbor] = gScore[neighbor] + h(neighbor,end_node,a_network);
                  if (!came_from.includes(current)){
                    came_from.push(current);
                    a_result+=current;
                    document.getElementById("a-result").innerHTML = a_result;
                  }

                  //highlightEdge(neighbor, a_edges, a_nodes, a_network,current);
              }

          }
          }else{}

    }

    if(came_from.includes(current)){
        a_result+=" -> ";
    }


     //else return no solution*/

    }
    a_result="No se puede acceder al grafo"
    document.getElementById("a-result").innerHTML = a_result;

    // Obtencion tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-a").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
}

async function draw_path(start_node,end_node,array){
    var end=end_node;
    var start=start_node;
    var temp=[];
    var print="";
    a_result+="<br>Camino Óptimo:<br>"
    for(var i = 0; i<array.length;++i){
        for(var j = 0; j<array.length;++j){
            if(array[j].now==end){
                if(end==start_node){
                    temp.push(start_node);
                    temp=temp.reverse();

                    print+=start;
                    for(var h=1; h<temp.length;h++){
                        print+="->";
                        print+=temp[h];
                    }
                    a_result+=print;
                    document.getElementById("a-result").innerHTML = a_result;
                    return;
                }
                if(!temp.includes(end)){

                    temp.push(end);
                    end= array[j].from;
                }

            }
        }
    }



}

async function h (start_node,end_node,network){

  var s = network.getPosition(start_node);
  var e = network.getPosition(end_node);


  var h = Math.round((Math.abs(s.x-e.x)+Math.abs(s.y-e.y))/20);
  return h;
}


async function remove_from_array(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

async function get_weight(nodo,nodo_end){

    for(i=0;i<edges_array.length;++i){

        if((edges_array[i].from==nodo) && (edges_array[i].to==nodo_end)){
            current_weight = edges_array[i].weight;
            return
        }
    }
}

async function check_dir(nodo,nodo_end){
  for(i=0;i<edges_array.length;++i){

      if((edges_array[i].from==nodo) && (edges_array[i].to==nodo_end)){

          direction = true;
          return
      }
  }
  direction = false;
}


/* ---- Prim ---- */ // Gerry
function Prim(delay)
{
    // Algoritmo para desplegar en HTML
    var prim_code = "";
    prim_code += "MST ← ∅<br>";
    prim_code += "FOR i ← 1, ..., num_nodos DO<br>";
    prim_code += "&emsp;&emsp;distance(nodo[i]) ← ∞, parent(nodo[i]) ← NULL<br>";
    prim_code += "distance(nodo[1]) ← 0, parent(nodo[1]) ← nodo[1]<br>";
    prim_code += "WHILE queue ≠ ∅ DO<br>";
    prim_code += "&emsp;&emsp;u ← queue.obtenerMin()<br>";
    prim_code += "&emsp;&emsp;IF parent(u) ≠ u<br>";
    prim_code += "&emsp;&emsp;&emsp;&emsp;T.add({parent(u), u})<br>";
    prim_code += "&emsp;&emsp;FOR ALL {u, w} ∈ E do<br>";
    prim_code += "&emsp;&emsp;&emsp;&emsp;IF w ∈ queue AND l(u, w) < distance(w) THEN<br>";
    prim_code += "&emsp;&emsp;&emsp;&emsp;&emsp;distance(w) ← l(u, w), parent(w) ← u<br>";
    prim_code += "&emsp;&emsp;&emsp;&emsp;ELSE IF parent(w) = NULL THEN<br>";
    prim_code += "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;distance(w) ← l(u, w), parent(w) ← u<br>";
    prim_code += "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;queue.insert(w)<br>";
    prim_code += "END<br>";
    document.getElementById("prim-code").innerHTML = prim_code;

    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var prim_nodes = new vis.DataSet(nodes.get()); // Se hace una copia de los nodos y aristas
    var prim_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('prim-network'); // Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: prim_nodes,
        edges: prim_edges
    };
    var options = { };
    var prim_network = new vis.Network(container, data, options);
    //Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    // Se obtiene el nodo de origen usansdo el id del input del html
    var start_node = parseInt(document.getElementById("origin-prim").value); // En algunos algoritmos no se necesitará esto

// Se 'imprime' instruccion en ejecución
document.getElementById("prim-instruction").innerHTML = "Prim("+start_node+");";

    var time = PrimUtil(start_node, prim_network, prim_nodes, prim_edges, delay);
    return time;
}


async function PrimUtil(start_node, prim_network, prim_nodes, prim_edges, delay)
{
    var ti = performance.now();

    var mst = [];
    var prim_result = ""; // Tendrá el contenido del MST para mostrar en HTML
    var distance = [];
    var parent = [];

    for (var i = 0; i < node_number; i++)
    {
        distance[i] = Infinity;
        parent[i] = null;
    }

    distance[start_node - 1] = 0;
    parent[start_node - 1] = start_node;

    mst.push[start_node];
    prim_result += start_node;
    document.getElementById("prim-result").innerHTML = prim_result;
    prim_result += " -> ";

    var visited = [];
    visited.push(start_node);
    highlightNode(start_node, prim_nodes);

    while (visited.length > 0)
    {

document.getElementById("prim-instruction").innerHTML = "WHILE queue ≠ ∅ DO<br>";

        // Obtener el nodo que tenga la arista más corta
        var min = Infinity;
        var pos_min, pos_edge;
        for (var i = 0; i < visited.length; i++)
        {

          prim_result += "<br>queue:";
          prim_result += visited;
          prim_result += "<br>";
          document.getElementById("prim-result").innerHTML = prim_result;

            var temp = prim_network.getConnectedEdges(visited[i]);
            for (var j = 0; j < temp.length; j++)
            {
                if (prim_edges.get(temp[j]).from == visited[i])
                {
                    if(prim_edges.get(temp[j]).label < min)
                    {
                        min = prim_edges.get(temp[j]).label;
                        pos_min = i;
                        pos_edge = j;
                    }
                }
            }
        }

        var node_analized = visited[pos_min];
        await visit_Node(node_analized, prim_nodes, delay);
        // Evita error de iluminar arista en 1era iteracion:
        if(node_analized != start_node)
        {
            var edge = prim_network.getConnectedEdges(node_analized);
            highlightEdge(edge[pos_edge], prim_edges, prim_nodes, prim_network);
        }
        visited.splice(pos_min, 1);
        // Fin Obtener el nodo que tenga la arista más corta

        if(parent[node_analized - 1] != node_analized)
        {
            mst.push[node_analized];
            prim_result += node_analized;
            document.getElementById("prim-result").innerHTML = prim_result;
            prim_result += " -> ";
        }

        var neighbors = prim_network.getConnectedEdges(node_analized);

        for (var i = 0; i < neighbors.length; i++)
        {

document.getElementById("prim-instruction").innerHTML = "FOR ALL {u, w} ∈ E do<br>";

            if (visited.indexOf(prim_edges.get(neighbors[i]).to) != -1)
            {
                if (prim_edges.get(neighbors[i]).label < distance[prim_edges.get(neighbors[i]).to - 1])
                {

document.getElementById("prim-instruction").innerHTML = "IF w ∈ queue AND l(u, w) < distance(w) THEN<br>&emsp;distance(w) ← l(u, w), parent(w) ← u<br>";

                    distance[prim_edges.get(neighbors[i]).to - 1] = prim_edges.get(neighbors[i]).label;
                    parent[prim_edges.get(neighbors[i]).to - 1] = prim_edges.get(neighbors[i]).from;
                }
            } else if (parent[prim_edges.get(neighbors[i]).to - 1] == null)
            {

document.getElementById("prim-instruction").innerHTML = "ELSE IF parent(w) = NULL THEN<br>&emsp;distance(w) ← l(u, w), parent(w) ← u<br>&emsp;queue.insert(w)<br>";

                distance[prim_edges.get(neighbors[i]).to - 1] = prim_edges.get(neighbors[i]).label;
                parent[prim_edges.get(neighbors[i]).to - 1] = prim_edges.get(neighbors[i]).from;
                visited.push(prim_edges.get(neighbors[i]).to);

                highlightNode(prim_edges.get(neighbors[i]).to, prim_nodes);
            }
        }
    }
document.getElementById("prim-instruction").innerHTML = "END";

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-prim").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    return execution_time;
}


/* ---- Kruskal ---- */ // Gerry
function Kruskal(delay)
{
    // Algoritmo para desplegar en HTML
    var kruskal_code = "holis";
    kruskal_code += "<br>";
    kruskal_code += "&emsp;<br>";
    document.getElementById("kruskal-code").innerHTML = kruskal_code;

    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var kruskal_nodes = new vis.DataSet(nodes.get()); // Se hace una copia de los nodos y aristas
    var kruskal_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('kruskal-network'); // Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: kruskal_nodes,
        edges: kruskal_edges
    };
    var options = { };
    var kruskal_network = new vis.Network(container, data, options);
    //Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    // Se obtiene el nodo de origen usansdo el id del input en html
    var start_node = parseInt(document.getElementById("origin-kruskal").value); // En algunos algoritmos no se necesitará esto

// Se 'imprime' instruccion en ejecución
document.getElementById("kruskal-instruction").innerHTML = "Kruskal("+start_node+");";

    var time = KruskalUtil(start_node, kruskal_network, kruskal_nodes, kruskal_edges, delay);
    return time;
}

function KruskalUtil(delay)
{
    var ti = performance.now();

    var visited = [];
    for (var i = 0; i < node_number; i++){
        visited[i] = false;
    }

    Aristas.sort(function(a, b){return a.peso-b.peso});

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-kruskal").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    return execution_time;

}


/* ---- Dijkstra ---- */ // Rojo
var Dijkstra_sol;
function Dijkstra(delay) {
    // Algoritmo para desplegar en HTML
    var Dijkstra_code = "";
    Dijkstra_sol = " ";
    console.log("flag Dikjkstra");
    /*bfs_code += "var queue = new Queue();<br>";
    bfs_code += "nodo_inicial = VISITED;<br>";
    bfs_code += "queue.enqueue(nodo_inicial);<br>";
    bfs_code += "while queue NOT EMPTY<br>";
    bfs_code += "&emsp;current_node = queue.dequeue();<br>";
    bfs_code += "&emsp;for i in all adyacent_edges(current_node)<br>";
    bfs_code += "&emsp;&emsp;if i NOT VISITED<br>";
    bfs_code += "&emsp;&emsp;&emsp;i = VISITED;<br>";
    bfs_code += "&emsp;&emsp;&emsp;queue.enqueue(i);<br>";
    Codigo a
    */


    document.getElementById("dijkstra-code").innerHTML = Dijkstra_code;
    bfs_result = ""; // Limpia string

    // Se obtiene el nodo de origen usansdo el id del input
    // (todos son 'origin-algoritmo' -> checar html para obtener ids)
    var start_node = parseInt(document.getElementById("origin-dijkstra").value); // En algunos algoritmos no se necesitará esto
    var target_node = parseInt(document.getElementById("target-dijkstra").value);
    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var dij_nodes = new vis.DataSet(nodes.get()); // Se hace una copia de los nodos y aristas
    var dij_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('dijkstra-network'); // Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: dij_nodes,
        edges: dij_edges
    };
    var options = {};
    var dijkstra_network = new vis.Network(container, data, options);
    //Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    var Tabla = [node_number - 1]
    var Padres = [node_number - 1]
    //Array Tabla para los pesos de los nodos y Padres para sus respectivos descendientes

    for (var i = 0; i < node_number; i++) {
        Tabla[i] = Infinity;
        Padres[i] = Infinity;
    }

    // Se 'imprime' instruccion en ejecución

    var time = DijkstraUtil(start_node, target_node, dijkstra_network, dij_nodes, dij_edges, Tabla, Padres, delay);
    return time;

}
async function DijkstraUtil(start_node, target_node, dijkstranetwork, dij_nodes, dij_edges, Tabla, Padres, delay) {

    // Obtencion tiempos ejecucion; NO TOCAR
    var ti = performance.now();

    var visited = [];
    var toAnalize = [];
    var queue = new Queue();

    visited.push(start_node);
    queue.enqueue(start_node)
    Tabla[start_node - 1] = 0;

    while (visited.length != node_number) {
        var node_analized = queue.dequeue();

        await visit_Node(node_analized, dij_nodes, delay);
        await sleep(delay);
        for (var i = 0; i < Aristas.length; i++) {

            if (Aristas[i].origen == node_analized) {
                var flag = true;

                /*Se Comprueba si el peso en los nodos destino requieren de una actualizacion */

                if (Tabla[Aristas[i].destino - 1] > Aristas[i].peso + Tabla[node_analized - 1]) {
                    Tabla[Aristas[i].destino - 1] = Aristas[i].peso + Tabla[node_analized - 1];
                    Padres[[Aristas[i].destino - 1]] = node_analized;

                    /*Comprueba si el nodo ya fue analizado o no*/

                    for (var j = 0; j < visited.length; j++) {

                        if (Aristas[i].destino == visited[j]) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        toAnalize.push(Aristas[i].destino);
                        highlightNode(Aristas[i].destino, dij_nodes);
                        highlightEdge(Aristas[i].ID, dij_edges, dij_nodes, dijkstranetwork, -1)
                    }

                }
            }
        }
        if (toAnalize.length == 0) {
            break;

        }
        var pesominimo = Infinity;
        var min = Infinity;
        var aux;
        //Variables auxiliares para detectar el menor peso dentro de los nodos que no se han analizado

        /*De los nodos que se han descubierto, selecciona el de menor peso  */
        for (var i = 0; i < toAnalize.length; i++) {
            if ((Tabla[toAnalize[i] - 1]) < pesominimo) {
                pesominimo = Tabla[toAnalize[i] - 1];
                min = toAnalize[i];
                aux = i;
            }
        }
        /*Se agrega el nodo a los analizados, se elimina de los posibles a analizar y se agrega a la cola para ser analizado en la
        siguiente iteracion */

        visited.push(min);
        toAnalize.splice(aux, 1);
        queue.enqueue(min);
    }
    /*Detecta si existe o no el camino mediante la tabla de pesos*/
    if (Tabla[target_node - 1] == Infinity) {
        Dijkstra_sol = "No hay un camino hacia ese nodo"
    }
    else {
        var padre = Padres[target_node - 1];
        var path = target_node;
        var cont = 0;

        /*Ciclo que construye el path a través de las posiciones de los padres */

        while (padre != start_node && start_node != target_node) {

            path = padre + " -> " + path;
            padre = Padres[padre - 1];
            cont++;
        }
        path = start_node + " -> " + path;
        Dijkstra_sol = path + "<br>" + "Distancia: " + Tabla[target_node - 1];
    }
    document.getElementById("dijkstra-result").innerHTML = Dijkstra_sol;

    // Obtencion tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-dijkstra").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    return execution_time;
}


/* ---- Bellman-Ford ---- */
var Bellman_sol;
function Belford(delay)
{
    // Algoritmo para desplegar en HTML
    var Bellman_code = "";
    Bellman_sol = " ";
    console.log("Bellford");
    /*bfs_code += "var queue = new Queue();<br>";
    bfs_code += "nodo_inicial = VISITED;<br>";
    bfs_code += "queue.enqueue(nodo_inicial);<br>";
    bfs_code += "while queue NOT EMPTY<br>";
    bfs_code += "&emsp;current_node = queue.dequeue();<br>";
    bfs_code += "&emsp;for i in all adyacent_edges(current_node)<br>";
    bfs_code += "&emsp;&emsp;if i NOT VISITED<br>";
    bfs_code += "&emsp;&emsp;&emsp;i = VISITED;<br>";
    bfs_code += "&emsp;&emsp;&emsp;queue.enqueue(i);<br>";
    Codigo a
    */
    document.getElementById("belford-code").innerHTML = Bellman_code;

    // Se obtiene el nodo de origen usansdo el id del input
    // (todos son 'origin-algoritmo' -> checar html para obtener ids)
    var start_node = parseInt(document.getElementById("origin-belford").value); // En algunos algoritmos no se necesitará esto
    var target_node = parseInt(document.getElementById("target-belford").value);
    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var bel_nodes = new vis.DataSet(nodes.get()); // Se hace una copia de los nodos y aristas
    var bel_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('belford-network'); // Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: bel_nodes,
        edges: bel_edges
    };
    var options = {};
    var belford_network = new vis.Network(container, data, options);
    //Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    var Tabla = [node_number - 1]
    var Padres = [node_number - 1]
    //Array Tabla para los pesos de los nodos y Padres para sus respectivos descendientes
    var visited = [];
    for (var i = 0; i < node_number; i++) {
        Tabla[i] = Infinity;
        Padres[i] = Infinity;
        visited[i]=i+1;
    }
    //highlightNode(2,bel_nodes);
    var time =BelfordUtil(start_node,target_node,belford_network,bel_nodes,bel_edges,Tabla,Padres,visited,delay);


    return time;
}

async function BelfordUtil(start_node, target_node, belfordnetwork, bel_nodes, bel_edges, Tabla, Padres, visited,delay) {
    var ti = performance.now();
    visited.splice(start_node-1,1);
    visited.unshift(start_node);
    
    var queue = new Queue();
    queue.enqueue(start_node)
    Tabla[start_node - 1] = 0;
    
    
    for(var i=0;i<node_number-2;++i){
        cleanGraph(bel_nodes,bel_edges);
        for(var j=0;j<visited.length;j++){
             await visit_Node(visited[j],bel_nodes);
             await sleep(delay);
            for(var k=0;k<Aristas.length;k++){
                if(Aristas[k].origen==visited[j]){
                    highlightEdge(Aristas[k].ID,bel_edges,bel_nodes,belfordnetwork,-1)
                    await sleep(delay);
                    if(Tabla[Aristas[k].destino-1]>Aristas[k].peso+Tabla[ [Aristas[k].origen] -1]){
                        Tabla[Aristas[k].destino-1]=Aristas[k].peso+Tabla[visited[j]-1]
                        Padres[[Aristas[k].destino - 1]] = Aristas[k].origen;

                    }
                }
            }
        }
    }
    if (Tabla[target_node - 1] == Infinity) {
        Bellman_sol = "No hay un camino hacia ese nodo"
    }
    else {
        var padre = Padres[target_node - 1];
        var path = target_node;
        var cont = 0;

        /*Ciclo que construye el path a través de las posiciones de los padres */

        while (padre != start_node && start_node != target_node) {

            path = padre + " -> " + path;
            padre = Padres[padre - 1];
            cont++;
        }
        path = start_node + " -> " + path;
        Bellman_sol = path + "<br>" + "Distancia: " + Tabla[target_node - 1];
    }
    
    document.getElementById("belford-result").innerHTML = Bellman_sol;
    
    // Obtencion tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-belford").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
    return execution_time;
}

/* ---- Floyd-Warshall ---- */
function Floyd(delay)
{

}

async function FloydUtil(delay)
{
    // Obtencion tiempos ejecucion; NO TOCAR
    var ti = performance.now();



    // Obtencion tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-floyd").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
}


/* -------------------------------------------------------------------------- */
/* --------------------- TEST DE GRÁFICAS ------------------------ */
var chart;



  

async function test_graph(){



         chart = Highcharts.chart('grafico-algoritmos', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Tiempos de Comparación'
            },
            xAxis: {
                categories:categories_graph
            },
            yAxis: {
                title: {
                    text: 'Segundos'
                }
            },
            series: [{
                name: 'Grafo 1',
                data: dataGraph
            }

        ],  exporting: {

            csv: {
                columnHeaderFormatter: function(item, key) {
                    if (item.name) {
                      return item.name
                    }
                    return item.bar
                  },
                lineDelimiter: '\n'

            }
          }
        });

}
function downlaodCsv() {
    chart.downloadCSV()
  }

/* -------------------------------------------------------------------------- */
/* --------------------- COMPARACIONES (PARALELISMO) ------------------------ */

/* Todos las funciones que se ejecutan cuando se corre un algoritmo desde la sección de comparación*/
async function runAlgorithm(algorithm) {
    var algorithm_checkbox = "compare-" + algorithm;
    var bar_id = "bar-" + algorithm;
    var time_id = "medicion-" + algorithm;
    var execution_time = 0;

    var progress_bar = document.getElementById(bar_id);
    progress_bar.style.width = "1%";
    progress_bar.innerHTML  = "";

    document.getElementById(time_id).innerHTML = "0.00 milisegundos"

    document.getElementById("origin-"+algorithm).value = parseInt(document.getElementById("origin-all").value);

    if(document.getElementById(algorithm_checkbox).checked) {
        var ti = performance.now();
        //load_progressBar(algorithm, 100); //Esta llamada debera ejecutarse dentro de sus códigos

        switch(algorithm) {
            case "dfs":
                load_progressBar(algorithm, 60);
                await DFS(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("DFS");
                check_check_box=true;

                break;
            case "bfs":


                categories_graph.push("BFS");
                check_check_box=true;
                break;
            case "a":
                document.getElementById("end-a").value = parseInt(document.getElementById("target-all").value);
                load_progressBar(algorithm, 60);
                await A_star(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("A*");
                check_check_box=true;
                break;
            case "prim":
                //Ingresar codigo del algoritmo con velocidad normal

                categories_graph.push("Prim");
                check_check_box=true;
                break;
            case "kruskal":
                //Ingresar codigo del algoritmo con velocidad normal

                categories_graph.push("Kruskal");
                check_check_box=true;
                break;
            case "dijkstra":
                document.getElementById("target-dijkstra").value = parseInt(document.getElementById("target-all").value);

                categories_graph.push("Dijkstra");
                check_check_box=true;
                break;
            case "belford":
                //Ingresar codigo del algoritmo con velocidad normal

                categories_graph.push("Belford");
                check_check_box=true;
                break;
            case "floyd":
                //Ingresar codigo del algoritmo con velocidad normal

                categories_graph.push("floyd");
                check_check_box=true;
                break;
        }

        var tf = performance.now()
        execution_time = tf - ti;

        document.getElementById(time_id).innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
        if(check_check_box){
        dataGraph.push(execution_time);
        }

    }
    test_graph();
}

/* Ejecuta todos los allgoritmos seleccionados en la sección de comparación */
function compareAlgorithms() {
    dataGraph.length=0;
    categories_graph.length=0;
    /* Paralelisación: sirve, pero no para esto (no puede hacer métodos para accesar al HTML) */
    //var p = new Parallel(["dfs", "bfs", "a", "prim", "kruskal", "dijktra", "belford", "floyd"], {evalPath: './eval.js'});
    //console.log(p.data);
    //p.map(runAlgorithm);

    //Estas llamadas son las que deberemos paralelizar
    runAlgorithm("dfs");
    runAlgorithm("bfs");
    runAlgorithm("a");
    runAlgorithm("prim");
    runAlgorithm("kruskal");
    runAlgorithm("dijkstra");
    runAlgorithm("belford");
    runAlgorithm("floyd");

    //Se genera la gráfica
}

/* ---- "MAIN" ---- */
drawRandomGraph();
