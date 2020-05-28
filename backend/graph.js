/* ---- VARIABLES GLOBALES ---- */
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var network = null;

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
        var Arista= {
            origen:origin,
            destino:destination,
            peso:weight
        
        };
        Aristas.push(Arista);
        return 0;
    }
    return -1;
}


/* Genera grafo */
function drawGraph(no_nodes, no_edges) {
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
    destroy();

    node_number = 8;
    edge_number = 7;
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
    var weight = Math.floor(Math.random() * 15) + 1;
    i += addEdge(i, origin, destination, weight);

    i = 2;
    origin = 1;
    destination = 3;
    weight = Math.floor(Math.random() * 15) + 1;
    i+=addEdge(i, origin, destination, weight);

    i = 3;
    origin = 2;
    destination = 4;
    weight = Math.floor(Math.random() * 15) + 1;
    i += addEdge(i, origin, destination, weight);

    i = 4;
    origin = 2;
    destination = 5;
    weight = Math.floor(Math.random() * 15) + 1;
    i += addEdge(i, origin, destination, weight);

    i = 5;
    origin = 3;
    destination = 6;
    weight = Math.floor(Math.random() * 15) + 1;
    i += addEdge(i, origin, destination, weight);

    i = 6;
    origin = 5;
    destination = 8;
    weight = Math.floor(Math.random() * 15) + 1;
    i += addEdge(i, origin, destination, weight);

    i = 7;
    origin = 3;
    destination = 7;
    weight = Math.floor(Math.random() * 15) + 1;
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
function visit_Node(node_analized, node_group)
{
  return new Promise(resolve => {
    setTimeout(() => {
      markVisited_Node(node_analized, node_group);
      resolve(true);
    }, 3000);
  });
}


/* Regresa nodo a valores preestablecidos */
function resetAnimation_Node(id, node_group) {
    node_group.update({id: i+1, borderWidth: 1, color: {border: "#2B7CE9", background: '#97C2FC'}, font: {color: "black"}, shapeProperties: {borderDashes: false}})
}


/* Regresa arista a valores preestablecidos */
function resetAnimation_Edge(id, edge_group) {
    edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: false})
}


/* Para quitarle todos los highlights a grafo */
function cleanGraph(node_group, edge_group){
  var i;
  for(i = 0; i < node_group.length; i++){
    resetAnimation_Node(i+1, node_group);
  }
  for(i = 0; i < edge_group.length; i++){
    resetAnimation_Edge(i+1, edge_group);
  }
}

/* Animar barras de avance */
function load_progressBar(algorithm) {
  var bar_id = "bar-" + algorithm;

    var progress_bar = document.getElementById(bar_id);
    progress_bar.innerHTML = "";
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
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
// las complejidades (desde el .html)
// y el código del algoritmo (desde cualquiera).

// Checa los ids correspondientes a cada cosa en el main.html
// Si le hace falta algo en el html para su algoritmo decirle a Andrés.


/* ---- DFS ---- */
var dfs_result; // String con recorrido de algoritmo.
function DFS() {
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
    dfs_result = ""; // Limpia string

    // Se obtiene el nodo de origen usando el id del input
    // ids se encuentran en main.html. (todos son 'origin-algoritmo')
    var start_node = parseInt(document.getElementById("origin-dfs").value);

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

    var visited = [];
    for (var i = 0; i < node_number; i++)
        visited[i] = false;

    // Se 'imprime' instrucción en ejecución
    document.getElementById("dfs-instruction").innerHTML = "DFS("+start_node+");";

    DFSUtil(start_node, visited, dfs_network, dfs_nodes, dfs_edges);
}


async function DFSUtil(current_node, visited, dfs_network, dfs_nodes, dfs_edges) {
    var stack = [];
    stack.push(current_node);
    document.getElementById("dfs-instruction").innerHTML = "stack.push["+current_node+"];";

    highlightNode(current_node, dfs_nodes);
    while (stack.length > 0)
    {
        var node_analized = stack.pop();

        if(!visited[node_analized - 1])
        {
            const visit_Node_bool = await visit_Node(node_analized, dfs_nodes);
            dfs_result += node_analized;
            const sleep_bool = await sleep(1000);
            visited[node_analized - 1] = true;
            var neighbors = dfs_network.getConnectedEdges(node_analized);
            document.getElementById("dfs-instruction").innerHTML = "var neighbors = network.getConnectedEdges(" + current_node + ");";
            var i;
            for (i = 0; i < neighbors.length; i++)
            {
                if (dfs_edges.get(neighbors[i]).from == node_analized)
                {
                    document.getElementById("dfs-result").innerHTML = dfs_result;
                    var destination = dfs_edges.get(neighbors[i]).to;
                    document.getElementById("dfs-instruction").innerHTML = "var destination = dfs_edges.get(neighbors["+i+"]).to;";
                    stack.push(destination);
                    highlightEdge(neighbors[i], dfs_edges, dfs_nodes, dfs_network, node_analized);
                }
            }
        }
        dfs_result += " -> ";
    }
}

/* ---- BFS ---- */
var bfs_result;
function BFS()
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
    bfs_result = ""; // Limpia string

    // Se obtiene el nodo de origen usansdo el id del input
    // (todos son 'origin-algoritmo' -> checar html para obtener ids)
    var start_node = parseInt(document.getElementById("origin-bfs").value); // En algunos algoritmos no se necesitará esto

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
    //Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    var visited = [];
    for (var i = 0; i < node_number; i++)
        visited[i] = false;

    // Se 'imprime' instruccion en ejecución
    document.getElementById("bfs-instruction").innerHTML = "BFS("+start_node+");";

    BFSUtil(start_node, visited, bfs_network, bfs_nodes, bfs_edges);
}


async function BFSUtil(start_node, visited, bfs_network, bfs_nodes, bfs_edges)
{
    var queue = new Queue();
    highlightNode(start_node, bfs_nodes);

    visited[start_node - 1] = true;

    document.getElementById("bfs-instruction").innerHTML = "queue.enqueue["+start_node+"];";
    queue.enqueue(start_node);

    // const sleep_bool = await sleep(100);
    // _stop = false;
    while (!queue.isEmpty())
    {
        var node_analized = queue.dequeue();
        bfs_result += node_analized;

        visited[node_analized - 1] = true;
        var neighbors = bfs_network.getConnectedEdges(node_analized);
        document.getElementById("bfs-instruction").innerHTML = "var neighbors = network.getConnectedEdges(" + node_analized + ");";


        const visit_Node_bool = await visit_Node(node_analized, bfs_nodes);
        document.getElementById("bfs-result").innerHTML = bfs_result;
        // if(_stop) { return; }
        const sleep_bool = await sleep(1000);
        // if(_stop) { return; }

        var i;
        for (i = 0; i < neighbors.length; i++)
        {
            if (bfs_edges.get(neighbors[i]).from == node_analized)
            {
                var destination = bfs_edges.get(neighbors[i]).to;
                document.getElementById("bfs-instruction").innerHTML = "var destination = bfs_edges.get(neighbors["+i+"]).to;";
                if(!visited[destination])
                {
                    highlightEdge(neighbors[i], bfs_edges, bfs_nodes, bfs_network, node_analized);
                    queue.enqueue(destination);
                }
            }
        }
        bfs_result += " -> ";
    }
}
function Dijkstra(){
    // Algoritmo para desplegar en HTML
    var Dijkstra_code = " Codigo-Diksstra";
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
    var target_node=parseInt(document.getElementById("target-dijkstra").value);
    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var dij_nodes = new vis.DataSet(nodes.get()); // Se hace una copia de los nodos y aristas
    var dij_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('dijkstra-network'); // Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: dij_nodes,
        edges: dij_edges
    };
    var options = { };
    var dijkstra_network = new vis.Network(container, data, options);
    //Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    var visited = [];

    var Tabla=[node_number-1]
    for(var i=0;i<node_number;i++){
        Tabla[i]=Infinity;
    }

    for (var i = 0; i < node_number; i++)
        visited[i] = false;

    // Se 'imprime' instruccion en ejecución
    document.getElementById("bfs-instruction").innerHTML = "BFS("+start_node+");";
    DijkstraUtil(start_node,target_node,dijkstra_network,dij_nodes,dij_edges,Tabla)

}
async function DijkstraUtil(start_node,target_node,dijkstranetwork,dij_nodes,dij_edges,Tabla){
    var visited=[];
    var toAnalize=[];
    var queue = new Queue();

    highlightNode(start_node, dij_nodes);
    visited.push(start_node);
    queue.enqueue(start_node)
    Tabla[start_node-1]=0;

    while(visited.length!=node_number){
        var node_analized= queue.dequeue();
        console.log(node_analized+ "<- Le nodo");
        for(var i=0;i<Aristas.length;i++){
            if(Aristas[i].origen==node_analized){
                //Revisar esto y hacer tabla de padres!!!
                //console.log("Lo que hay en "+Tabla[node_analized-1])
                //var dest=Aristas[i].destino;
                if(Tabla[Aristas[i].destino-1]>Aristas[i].peso+Tabla[node_analized-1]){
                    Tabla[Aristas[i].destino-1]=Aristas[i].peso+Tabla[node_analized-1];
                    for(var j=0;j<visited.length;j++){
                        if(Aristas[i].destino==visited[j]){
                            break;
                        }
                        toAnalize.push(Aristas[i].destino);
                    }
                   // console.log("FALF");
                    console.log("Tabla: "+ node_analized +" i  "+Aristas[i].destino+"  "+Tabla[Aristas[i].destino-1])
                    
                }
            }
        }
        console.log("To analize: "+toAnalize[0]);
        console.log("To analize: "+toAnalize[1]);
        if(toAnalize.length==0){
            console.log("????");
            break;

        }
        var min=Infinity;
        var aux;
        for(var i=0;i<toAnalize.length;i++){
            if((Tabla[toAnalize[i]-1])<min){
                console.log("Es el minimo ");
                min=toAnalize[i];
                aux=i;
            }
        }
        console.log("min "+min+" "+Tabla[min-1])
        visited.push(min);
        toAnalize.splice(aux,1);
        queue.enqueue(min);
        // Tabla.forEach(element => {
        //     console.log("---"+element);
        // });



    }
    console.log("FIN");
    if(Tabla[target_node-1]==Infinity){
        console.log("No hay un camino hacia ese nodo");
    }
    else{
        console.log("El camino minimo es: "+Tabla[target_node-1]);
    }
    //console.log(Tabla[0]+" "+Tabla[1]+" "+Tabla[2]+" "+Tabla[3]+" "+Tabla[4]+" "+Tabla[5]+" "+Tabla[6]+" ")

}


/* -------------------------------------------------------------------------- */
/* --------------------- COMPARACIONES (PARALELISMO) ------------------------ */

/* Todos las funciones que se ejecutan cuando se corre un algoritmo desde la sección de comparación*/
function runAlgorithm(algorithm) {
    var algorithm_checkbox = "compare-" + algorithm; 

    if(document.getElementById(algorithm_checkbox).checked) {
        load_progressBar(algorithm); 
        //Agregar el resto de los métodos que se utilicen 
    }
}

/* Ejecuta todos los allgoritmos seleccionados en la sección de comparación */
function compareAlgorithms() {
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
// console.log(Aristas[0].origen);

// Aristas.sort(function (a,b){
//     if(a.origen<b.origen){
//         return -1;
//     }
//     else if(a.origen<b.origen){
//         return 1;
//     }
//     return 0;
// });

// console.log(Aristas[1].origen);
// var Tabla=[node_number-1]
// for(var i=0;i<node_number;i++){
//     Tabla[i]=Infinity;
// }
// console.log(Tabla[0]);
// var prueba=[];
// prueba.push("hola");
// prueba.push("como");
// prueba.push("estas");
// prueba.push("atm");
// prueba.forEach(element => {
//     console.log(element);
// });
// console.log("----");
// prueba.splice(1,1);
// prueba.forEach(element => {
//     console.log(element);
// });