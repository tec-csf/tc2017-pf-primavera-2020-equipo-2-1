/* ---- VARIABLES GLOBALES ---- */
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var network = null;

var step_duration = 2000; // ms = 1 segundo
var node_number, edge_number;
var edges_array = [];

/* ---- CREACIÓN DE GRAFO ---- */
function destroy() {
    if (network !== null) {
        nodes.clear();
        edges.clear();
        network.destroy();
        network = null;
    }
}


function addNode(id) {
    var id_shown = id.toString();
    nodes.add({id: id, label: id_shown});
}


function addEdge(id, origin, destination, weight) {
    if (!isNeighbour(origin, destination)) {
        var shown_weight = weight.toString();
        edges.add({id: id, from: origin, to: destination, label: shown_weight, arrows: 'to', color: {color: "#2B7CE9", inherit: false}});
        edges_array.push({id: id, from: origin, to: destination, weight: weight});
        return 0;
    }
    return -1;
}


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

    // create a network
    var container = document.getElementById('mynetwork');

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = { };

    // initialize your network!
    network = new vis.Network(container, data, options);
}


function drawRandomGraph() {
    var no_nodes = Math.floor(Math.random() * 11) + 5; //Número de nodos entre 5 y 15
    var no_edges = Math.floor(Math.random() * (no_nodes+1)) + no_nodes; //Número de aristas entre la cantidad de nodos y 2 veces la cantidad de nodos

    // Poner los números generados en la página
    document.getElementById("node-set").value = no_nodes;
    document.getElementById("edge-set").value = no_edges;

    drawGraph(no_nodes, no_edges);
}


function drawSetGraph() {
    var nodes_set = document.getElementById("node-set").value;
    var edges_set = document.getElementById("edge-set").value;

    drawGraph(nodes_set, edges_set);
}

function drawTestGraph() {
    destroy();

    node_number = 8;
    edge_number = 7;
    var no_nodes = node_number;
    var no_edges = edge_number;

    // Poner los números generados en la página
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
    i+=addEdge(i, origin, destination, weight);

    i = 2;
    origin = 1;
    destination = 3;
    weight = Math.floor(Math.random() * 15) + 1;
    i+=addEdge(i, origin, destination, weight);

    i = 3;
    origin = 2;
    destination = 4;
    weight = Math.floor(Math.random() * 15) + 1;
    i+=addEdge(i, origin, destination, weight);

    i = 4;
    origin = 2;
    destination = 5;
    weight = Math.floor(Math.random() * 15) + 1;
    i+=addEdge(i, origin, destination, weight);

    i = 5;
    origin = 3;
    destination = 6;
    weight = Math.floor(Math.random() * 15) + 1;
    i+=addEdge(i, origin, destination, weight);

    i = 6;
    origin = 5;
    destination = 8;
    weight = Math.floor(Math.random() * 15) + 1;
    i+=addEdge(i, origin, destination, weight);

     i = 7;
     origin = 3;
     destination = 7;
     weight = Math.floor(Math.random() * 15) + 1;
     i+=addEdge(i, origin, destination, weight);

    // create a network
    var container = document.getElementById('mynetwork');

    // provide the data in the vis format
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        //nodes: {shape: "circle"}
    };

    // initialize your network!
    network = new vis.Network(container, data, options);
}


/* ---- ESTILIZACIÓN ---- */
// function highlightNode(id, node_group) {
//     //Se usan los grupos de nodos individuales de cada algorimto para no activar todas las animaciones
//     node_group.update({id: id, borderWidth: 3, color: {border: "red"}});
// }
//
//
// function highlightEdge(id, edge_group) {
//     edge_group.update({id: id, width: 3, color: {color: "red"}});
// }
//
//
// function markVisited_node(id, node_group) {
//     node_group.update({id: id, borderWidth: 1, color: {border: "red"}, shapeProperties: {borderDashes: [5, 5]}});
// }
//
//
// function markVisited_edge(id, edge_group) {
//     edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: [5, 5]});
// }
//
//
// function resetAnimation_Node(id, node_group) {
//     node_group.update({id: id, borderWidth: 1, color: {border: "#2B7CE9"}, shapeProperties: {borderDashes: false}})
// }
//
//
// function resetAnimation_Edge(id, edge_group) {
//     edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: false})
// }


function highlightNode(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {background: '#5284AF'}});
}


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


function dashNode(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {border: "red"}, shapeProperties: {borderDashes: [5, 5]}});
}


function dashEdge(id, edge_group) {
    edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: [5, 5]});
}


function markVisited_Node(id, node_group) {
  node_group.update({id: id, borderWidth: 3, color: {border: "red", background: '#5284AF'}, font: {color: '#FEFEFE'}});
}


function resetAnimation_Node(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {border: "#2B7CE9"}, shapeProperties: {borderDashes: false}})
}


function resetAnimation_Edge(id, edge_group) {
    edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: false})
}

/* Para Quitarle todos los highlight, pero Andrés ya lo logró de otra manera */
function cleanGraph(node_group, edge_group){
  var i;
  for(i = 0; i < node_group.length; i++){
    node_group.update({id: i+1, borderWidth: 1, color: {border: "#2B7CE9", background: '#97C2FC'}, font: {color: "black"}, shapeProperties: {borderDashes: false}})
  }
  for(i = 0; i < edge_group.length; i++){
    edge_group.update({id: i+1, width: 1, color: {color: "#2B7CE9"}, dashes: false})
  }
}



/* ---- ACCESO ---- */
function isNeighbour(origin, destination) {
    for(let i=1; i <= edges.length; ++i)
        if (edges.get(i).from == origin)
            if (edges.get(i).to == destination)
                return true;
    return false;
}


/* ---- OTROS ---- */
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


function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(true); }, ms);
  });
}


function visit_Node(node_analized, node_group)
{
  return new Promise(resolve => {
    setTimeout(() => {
      markVisited_Node(node_analized, node_group);
      resolve(true);
    }, 3000);
  });
}


/* -------------------------------------------------------------------------- */
/* ------------------------------- ALGORITMOS ------------------------------- */

// Hace falta meter la medición de tiempo (desde el .js);
// las complejidades (desde el .html)
// y el código del algorimto (desde cualquiera).

// Checa los ids correspondientes a cada cosa en el main.html
// Si le hace falta algo en el html para su algorimto decirle a Andrés.


/* ---- DFS ---- */
var dfs_result; //En esta variable estoy poniendo el camino que toma para que la imprima en cada llamada
function DFS() {
    dfs_result = ""; //Cada vez que se llama se reinicia el resultado
    //Se obtiene el nodo de origen usando el id del input
    // (todos son 'origin-algorimtmo' -> checar html para obtener ids)
    var start_node = parseInt(document.getElementById("origin-dfs").value); //En algunos algorimtos no se necesitará esto

    //Se tiene que volver a hacer un dibujo del grafo para tener animaciones individuales
    var dfs_nodes = new vis.DataSet(nodes.get()); //Se hace una copia de los nodos y aristas
    var dfs_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('dfs-network'); //Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: dfs_nodes,
        edges: dfs_edges
    };
    var options = {};
    var dfs_network = new vis.Network(container, data, options);
    //Hasta aqui es el proceso que siempre se debe de seguir para tener grafos independientes

    var visited = [];
    for (var i = 1; i <= node_number; i++)
        visited[i] = false;

    document.getElementById("dfs-instruction").innerHTML = "DFS("+start_node+");"; //Con esto estoy 'imrpimiendo' las instrucciones que se estan ejecutando en el momento (no puse muchas de estas, son de ejemplo)
    setTimeout(DFSUtil, step_duration, start_node, visited, dfs_nodes, dfs_edges, ""); //Este es un timpo de llamada recursiva que tiene delay, creo que Gerry ya encontró algo más óptimo
}


function DFSUtil(current_node, visited, dfs_nodes, dfs_edges) {
    document.getElementById("dfs-instruction").innerHTML = "visited["+current_node+"] = true;";
    visited[current_node] = true;
    dfs_result+= " -> " + current_node; //Se actualiza el resultado del algorimto
    //console.log(current_node);
    document.getElementById("dfs-result").innerHTML = dfs_result; //Se va imprime el resultado actualizado

    var neighbors = network.getConnectedEdges(current_node);
    document.getElementById("dfs-instruction").innerHTML = "var neighbors = network.getConnectedEdges(" + current_node + ");";
    highlightNode(current_node, dfs_nodes); //Se hace la animación, se manda como parametro los nodes o edges propios de este algoritmo (si no se hace esto se modifican el resto de los grafos)

    for (var i in neighbors) {
        if (dfs_edges.get(neighbors[i]).from == current_node){
            var destination = dfs_edges.get(neighbors[i]).to;
            document.getElementById("dfs-instruction").innerHTML = "var destination = dfs_edges.get(neighbors["+i+"]).to;";
            highlightEdge(neighbors[i], dfs_edges);
            document.getElementById("dfs-instruction").innerHTML = "if (!visited["+destination+"])";
            if (!visited[destination]){
                setTimeout(DFSUtil, step_duration, destination, visited, dfs_nodes, dfs_edges);
                document.getElementById("dfs-instruction").innerHTML = "DFS("+destination+");";
            }
            else
                markVisited_edge(neighbors[i], dfs_edges);
        }
    }
}

/* ---- BFS ---- */
function BFS()
{
    //cleanGraph();
    // Se obtiene el nodo de origen usansdo el id del input
    // (todos son 'origin-algoritmo' -> checar html para obtener ids)
    var start_node = parseInt(document.getElementById("origin-bfs").value); // En algunos algorimtos no se necesitará esto

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

    BFSUtil(start_node, visited, bfs_network, bfs_nodes, bfs_edges);
}


async function BFSUtil(start_node, visited, bfs_network, bfs_nodes, bfs_edges)
{
    console.log(start_node);

    var queue = new Queue();
    highlightNode(start_node, bfs_nodes);

    visited[start_node - 1] = true;

    queue.enqueue(start_node);

    // const sleep_bool = await sleep(100);
    // _stop = false;
    while (!queue.isEmpty())
    {
        var node_analized = queue.dequeue();
        visited[node_analized - 1] = true;
        var neighbors = bfs_network.getConnectedEdges(node_analized);

        const visit_Node_bool = await visit_Node(node_analized, bfs_nodes);
        // if(_stop) { return; }
        const sleep_bool = await sleep(1000);
        // if(_stop) { return; }

        var i;
        for (i = 0; i < neighbors.length; i++)
        {
            if (bfs_edges.get(neighbors[i]).from == node_analized)
            {
                var destination = bfs_edges.get(neighbors[i]).to;
                if(!visited[destination])
                {
                    highlightEdge(neighbors[i], bfs_edges, bfs_nodes, bfs_network, node_analized);
                    queue.enqueue(destination);
                }
            }
        }
    }
}


/* ---- "MAIN" ---- */
drawRandomGraph();