/* ---- VARIABLES GLOBALES ---- */
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
var network = null;
var dataGraph = [];
var categories_graph = [];

var node_number, edge_number;
var edges_array = [];
var Aristas = [];

/* ---- ALGORITMOS PARA LA CREACIÓN DE GRAFO ---- */

/* Elimina todos los valores del grafo */
function destroy() {
    if (network !== null) {
        nodes.clear();
        edges.clear();
        network.destroy();
        network = null;
        Aristas = [];
        edges_array = [];
    }
}


/* Función auxiliar de drawGraph que agrega al DataSet el nodo
 * @param id: ID del nodo que se será agregado
 */
function addNode(id) {
    var id_shown = id.toString();
    nodes.add({id: id, label: id_shown});
}


/* Función auxiliar de drawGraph que agrega al DataSet la arista
 * @param id: ID de la arista que se será agregada
 * @param origin: ID del nodo de donde "sale" la arista
 * @param destination: ID del nodo a donde "llega" la arista
 * @param weight: valor numérico de la ponderación de la arista
 */
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


/* Genera grafo
 * @param no_nodes: cantidad de nodos que serán creados
 * @param no_edges: cantidad de aristas que serán creadas
 */
function drawGraph(no_nodes, no_edges) {
    edges_array.length=0;
    destroy();

    node_number = no_nodes;
    edge_number = no_edges;

    for (var i = 1; i <= no_nodes; ++i) {
        addNode(i);
    }

    // Se asignan valores aleatorios para las aristas
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


/* Genera dos números aleatorios para representar
   el número de nodos y de aristas que tendrá el grafo
 */
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


/* Obtiene los valores de número de nodos y de aristas
   declarados en HTML para creación de grafo
 */
function drawSetGraph() {
    var nodes_set = document.getElementById("node-set").value;
    var edges_set = document.getElementById("edge-set").value;

    drawGraph(nodes_set, edges_set);
}


/* Genera un grafo constante utilizado para debug */
function drawTestGraph() {
    edges_array.length=0;
    destroy();

    node_number = 14;
    edge_number = 18;
    var no_nodes = node_number;
    var no_edges = edge_number;

    // Despliega los números generados en HTML
    document.getElementById("node-set").value = no_nodes;
    document.getElementById("edge-set").value = no_edges;

    var i;
    for (i = 1; i <= no_nodes; ++i) {
        addNode(i);
    }

      // Se colocan aristas entre los nodos
      addEdge(1, 3, 2, 1);0
      addEdge(2, 3, 7, 2);1
      addEdge(3, 2, 8, 8);2
      addEdge(4, 2, 1, 6);3
      addEdge(5, 7, 6, 4);4
      addEdge(6, 7, 8, 3);5
      addEdge(7, 7, 14, 2);6
      addEdge(8, 8, 10, 6);7
      addEdge(9, 8, 6, 2);8
      addEdge(10, 1, 4, 7);9
      addEdge(11, 1, 5, 9);10
      addEdge(12, 6, 9, 9);
      addEdge(13, 14, 10, 4);
      addEdge(14, 10, 12, 7);
      addEdge(15, 10, 11, 8);
      addEdge(16, 5, 11, 9);
      addEdge(17, 9, 8, 9);
      addEdge(18, 11, 13, 2);

      var container = document.getElementById('mynetwork');
      var data = {
          nodes: nodes,
          edges: edges
      };
      var options = { };

      // Inicializa Network
      network = new vis.Network(container, data, options);
}


/* ---- FUNCIONES DE ESTILIZACIÓN ---- */

/* Sombrea nodo; denota que ha sido visitado pero aún no ha sido analizado
 * @param id: id del nodo a sombrear
 * @param node_group: especifica el grupo de nodos que será modificado,
          esto para evitar que se sombreen nodos en el grafo de otro algoritmo
 */
function highlightNode(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {background: '#5284AF'}});
}


/* Marca las aristas que han sido recorridas
 * @param id: id del nodo a sombrear
 * @param edge_group: especifica el grupo de aristas que será modificado,
          esto para evitar que se sombreen aristas en el grafo de otro algoritmo
 * @param node_group: especifica el grupo de nodos que será modificado,
          esto para permitir sombrear los nodos a donde apuntan las aristas
          (en caso de ser necesitado)
 * @param network_group: especifica el gafo que será modificado, esto
          para permitir sombrear los nodos a donde apuntan las aristas
          (en caso de ser necesitado)
 * @param node_Id: ID del nodo de donde comienza la arista, esto permite
          sombrear todos los nodos conectados a éste (en caso de ser requerido)
 */
function highlightEdge(id, edge_group, node_group, network_group, node_Id) {
    edge_group.update({id: id, width: 3, color: {color: "red"}});
    if (node_Id !== undefined)
    {
        var connected_nodes = network_group.getConnectedNodes(node_Id, 'to');
        var i;
        for (i = 0; i < connected_nodes.length; ++i) {
            highlightNode(connected_nodes[i], node_group);
        }
    }
}


/* Rodea nodo con línea punteada; denota que ese nodo es inaccesible
 * @param id: id del nodo a puntear
 * @param node_group: especifica el grupo de nodos que será modificado, esto
          para evitar que se punteen nodos en el grafo de otro algoritmo
 */
function dashNode(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {border: "red"}, shapeProperties: {borderDashes: [5, 5]}});
}


/* Marca arista con línea punteada; denota que esa arista no se recorre
 * @param id: id de la arista a puntear
 * @param edge_group: especifica el grupo de aristas que será modificado, esto
           para evitar que se punteen aristas en el grafo de otro algoritmo
 */
function dashEdge(id, edge_group) {
    edge_group.update({id: id, width: 0, color: {color: "#2B7CE9"}, dashes: [5, 5]});
}


/* Rodea nodo con línea roja y enfatiza número;
   denota que ese nodo ha sido analizado.
 * @param id: id del nodo a marcar
 * @param node_group: especifica el grupo de nodos que será modificado,
          esto para evitar quese marquen nodos en el grafo de otro algoritmo
 */
function markVisited_Node(id, node_group) {
  node_group.update({id: id, borderWidth: 3, color: {border: "red", background: '#5284AF'}, font: {color: '#FEFEFE'}});
}


/* Regresa nodo a valores preestablecidos
 * @param id: id del nodo a marcar
 * @param node_group: especifica el grupo de nodos que será modificado,
          esto para evitar quese marquen nodos en el grafo de otro algoritmo
 */
function resetAnimation_Node(id, node_group) {
    node_group.update({id: id, borderWidth: 1, color: {border: "#2B7CE9", background: '#92C2FA'}, font: {color: '#343434'}, shapeProperties: {borderDashes: false}});
}


/* Regresa arista a valores preestablecidos
 * @param id: id de la arista a marcar
 * @param edge_group: especifica el grupo de aristas que será modificado, esto
          para evitar que se marquen aristas en el grafo de otro algoritmo
 */
function resetAnimation_Edge(id, edge_group) {
    edge_group.update({id: id, width: 1, color: {color: "#2B7CE9"}, dashes: false})
}


/* Para quitarle todos los highlights a grafo
 * @param node_group: especifica el grupo de nodos que será modificado, esto
          para evitar que se marquen nodos en el grafo de otro algoritmo
 * @param edge_group: especifica el grupo de aristas que será modificado, esto
          para evitar que se marquen aristas en el grafo de otro algoritmo
 */
function cleanGraph(node_group, edge_group) {
  for (var i = 0; i < node_group.length; ++i) {
      resetAnimation_Node(i+1, node_group);
  }
  for (var i = 0; i < edge_group.length; ++i) {
      resetAnimation_Edge(i+1, edge_group);
  }
}


/* Animar barras de avance
 * @param algorithm: etiqueta para que programe diferencie entre barrar
 * @param progress:
 */
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


/* ---- FUNCIONES DE ACCESO ---- */

/* Verifica si dos nodos están conectados directamente
 * @param origin: id del nodo orignen
 * @param destination: id del nodoo destino
 */
function isNeighbour(origin, destination) {
    for (let i=1; i <= edges.length; ++i)
        if (edges.get(i).from == origin)
            if (edges.get(i).to == destination)
                return true;
    return false;
}


/* ---- OTROS ---- */

/* Estructura para utilizar un contendor queue */
function Queue() {
  var a=[], b=0;
  this.getLength = function() { return a.length-b };
  this.isEmpty = function() { return 0==a.length };
  this.enqueue = function(b) { a.push(b) };
  this.dequeue = function() {
    if (0!=a.length) {
      var c=a[b];
      2*++b>=a.length&&(a=a.slice(b),b=0);
      return c
    }
  };
  this.peek=function() { return 0<a.length?a[b]:void 0 }
};


/* Estructura para utilizar un contendor DisjointSet */
class DisjointSet
{
     constructor(elements)
     {
          this.count = elements.length;
          this.parent = { };

          // Al inicio, cada cluster será padre de sí mismo
          elements.forEach(e => (this.parent[e] = e));
     }

     union(a, b)
     {
          let rootA = this.find(a);
          let rootB = this.find(b);

          // Si raíces son iguales, ya están conectadas
          if (rootA === rootB) return;

          // Siempre hace al elemento con raíz menor el padre
          if (rootA < rootB) {
              if (this.parent[b] != b) {
                  this.count++;
                  this.union(this.parent[b], a);
              }
              this.parent[b] = this.parent[a];
          } else {
              if (this.parent[a] != a) {
                  this.count++;
                  this.union(this.parent[a], b);
              }
               this.parent[a] = this.parent[b];
          }
          this.count -= 1;
     }

     // Regresa el último padre de un nodo
     find(a) {
          while (this.parent[a] !== a) {
              a = this.parent[a];
          }
        return a;
     }

     // Verifica si están conectados
     connected(a, b) {
          return this.find(a) === this.find(b);
     }
}


/* Crea un atraso de tiempo establecido para mejor visualización de recorrido
 * @param ms: cantidad de milisegundos que se hará el atraso
 */
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(true); }, ms);
  });
}


/* -------------------------------------------------------------------------- */
/* ------------------------------- ALGORITMOS ------------------------------- */

/* ---- DFS ---- Gerry
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
function DFS(delay)
{
    // Algoritmo para desplegar en HTML
    var dfs_code = "";
    dfs_code += "var stack = [];<br>";
    dfs_code += "stack.push(nodo_inicial);<br>";
    dfs_code += "while stack NOT EMPTY<br>";
    dfs_code += "&emsp;&emsp;current_node = stack.pop();<br>";
    dfs_code += "&emsp;&emsp;if current_node NOT VISITED;<br>";
    dfs_code += "&emsp;&emsp;&emsp;&emsp;current_node = VISITED;<br>";
    dfs_code += "&emsp;&emsp;&emsp;&emsp;for i in all adyacent_edges(current_node)<br>";
    dfs_code += "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;stack.push(i)";
    dfs_code += "END";
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
    var options = { };
    var dfs_network = new vis.Network(container, data, options);
    // Hasta aquí es el proceso para tener grafos independientes

    // Se obtiene el nodo de origen usando el id del input en html
    var start_node = parseInt(document.getElementById("origin-dfs").value);

    var time = DFSUtil(start_node, dfs_network, dfs_nodes, dfs_edges, delay);
    return time;
}


/* Función principal que ejecuta algoritmo de DFS
 * @param start_node: indica cual será el nodo de inicio del recorrido;
          recibido de html
 * @param dfs_network: grafo que se utilizará para ejecución de algoritmo;
          esto evita que se ejecuten comandos sobre otros algoritmos
 * @param dfs_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param dfs_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
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

    document.getElementById("dfs-instruction").innerHTML = "var stack = [];<br>stack.push(nodo_inicial);<br>";

    highlightNode(start_node, dfs_nodes);
    await sleep(delay);

    while (stack.length > 0)
    {
        document.getElementById("dfs-instruction").innerHTML = "while stack NOT EMPTY<br>&emsp;&emsp;current_node = stack.pop();<br>";

        var node_analized = stack.pop();
        var temp_stack = [];
        if (!visited[node_analized - 1])
        {
            await sleep(delay);
            markVisited_Node(node_analized, dfs_nodes)

            dfs_result += node_analized;
            document.getElementById("dfs-result").innerHTML = dfs_result;
            dfs_result += " -> ";

            visited[node_analized - 1] = true;

            var neighbors = dfs_network.getConnectedEdges(node_analized);

            document.getElementById("dfs-instruction").innerHTML = "if current_node NOT VISITED;<br>&emsp;&emsp;current_node = VISITED;<br>";
            await sleep(delay * 1.5);

            document.getElementById("dfs-instruction").innerHTML = "for i in all adyacent_edges(current_node)<br>&emsp;&emsp;stack.push(i)";
            for (var i = 0; i < neighbors.length; ++i)
            {
                if (dfs_edges.get(neighbors[i]).from == node_analized)
                {
                    var destination = dfs_edges.get(neighbors[i]).to;

                    // Organizo edges para que siga un orden ascendente de nodos
                    temp_stack.push(destination);
                    highlightEdge(neighbors[i], dfs_edges, dfs_nodes, dfs_network, node_analized);
                    if (visited[destination - 1] == true)
                    {
                        dashEdge(neighbors[i], dfs_edges);
                    }
                }
            }
            await sleep(delay);
        } else
        {
            console.log("Else");
        }
        // Con esto, el recorrido se hace en orden de nodos acendente
        temp_stack.sort(function(a, b) {return  b - a});
        for (var i = 0; i < temp_stack.length; ++i)
        {
            stack.push(temp_stack[i]);
        }
    }
    document.getElementById("dfs-instruction").innerHTML = "END";

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-dfs").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
    return execution_time;
}


/* ---- BFS ---- // Gerry
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
function BFS(delay)
{
    // Algoritmo para desplegar en HTML
    var bfs_code = "";
    bfs_code += "var queue = new Queue();<br>";
    bfs_code += "nodo_inicial = VISITED;<br>";
    bfs_code += "queue.enqueue(nodo_inicial);<br>";
    bfs_code += "while queue NOT EMPTY<br>";
    bfs_code += "&emsp;&emsp;current_node = queue.dequeue();<br>";
    bfs_code += "&emsp;&emsp;for i in all adyacent_edges(current_node)<br>";
    bfs_code += "&emsp;&emsp;&emsp;&emsp;if i NOT VISITED<br>";
    bfs_code += "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;i = VISITED;<br>";
    bfs_code += "&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;queue.enqueue(i);<br>";
    bfs_code += "END";
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
    // Hasta aquí es el proceso para tener grafos independientes

    // Se obtiene el nodo de origen usansdo el id del input en html
    var start_node = parseInt(document.getElementById("origin-bfs").value);

    // Se 'imprime' instrucción en ejecución
    document.getElementById("bfs-instruction").innerHTML = "BFS("+start_node+");";

    var time = BFSUtil(start_node, bfs_network, bfs_nodes, bfs_edges, delay);
    return time;
}


/* Función principal que ejecuta algoritmo de BFS
 * @param start_node: indica cual será el nodo de inicio del recorrido;
          recibido de html
 * @param bfs_network: grafo que se utilizará para ejecución de algoritmo;
          esto evita que se ejecuten comandos sobre otros algoritmos
 * @param bfs_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param bfs_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
async function BFSUtil(start_node, bfs_network, bfs_nodes, bfs_edges, delay)
{
    var ti = performance.now();

    var bfs_result = ""; // String con recorrido de algoritmo.
    document.getElementById("bfs-result").innerHTML = bfs_result;

    var visited = [];
    for (var i = 0; i < node_number; ++i)
        visited[i] = false;

    var queue = new Queue();
    highlightNode(start_node, bfs_nodes);

    visited[start_node - 1] = true;

    queue.enqueue(start_node);

    document.getElementById("bfs-instruction").innerHTML = "var queue = new Queue();<br>nodo_inicial = VISITED;<br>queue.enqueue(nodo_inicial);<br>";

    while (!queue.isEmpty())
    {
        var node_analized = queue.dequeue();
        await sleep(delay * 1.5);
        markVisited_Node(node_analized, bfs_nodes);

        bfs_result += node_analized;
        document.getElementById("bfs-result").innerHTML = bfs_result;
        bfs_result += " -> ";

        visited[node_analized - 1] = true;

        var neighbors = bfs_network.getConnectedEdges(node_analized);

        document.getElementById("bfs-instruction").innerHTML = "while queue NOT EMPTY<br>&emsp;current_node = queue.dequeue();<br>";
        await sleep(delay-100);

        var temp_queue = [];
        for (var i = 0; i < neighbors.length; ++i)
        {
            if (bfs_edges.get(neighbors[i]).from == node_analized)
            {
                var destination = bfs_edges.get(neighbors[i]).to;
                if (!visited[destination - 1])
                {

                    document.getElementById("bfs-instruction").innerHTML = "for i in all adyacent_edges(current_node)<br>&emsp;&emsp;if i NOT VISITED<br>&emsp;&emsp;&emsp;&emsp;i = VISITED;<br>&emsp;&emsp;&emsp;&emsp;queue.enqueue(i);<br>";
                    // Organizo edges para que siga un orden ascendente de nodos
                    temp_queue.push(destination);
                    highlightEdge(neighbors[i], bfs_edges, bfs_nodes, bfs_network, node_analized);
                    visited[destination - 1] = true;
                } else
                {
                    dashEdge(neighbors[i], bfs_edges);
                }
            }
        }
        // Con esto, el recorrido se hace en orden de nodos ascendente
        temp_queue.sort(function(a, b) {return a - b});
        for (var i = 0; i < temp_queue.length; ++i)
        {
            queue.enqueue(temp_queue[i]);
        }
    }
    document.getElementById("bfs-instruction").innerHTML = "END";

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-bfs").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    return execution_time;
}


/* ---- A* ----  // Quiroz
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
function A_star(delay)
{
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
    var options = { };
    var a_network = new vis.Network(container, data, options);
    // Hasta aquí es el proceso  para tener grafos independientes

    var gScore = [node_number - 1];
    var fScore = [node_number - 1];
    for (var i = 0; i < node_number; ++i)
    {
        gScore[i] = Infinity;
        fScore[i] = Infinity;
    }

    // Se 'imprime' instrucción en ejecución
    document.getElementById("a-instruction").innerHTML = "A("+start_node+");";

    var time = AUtil(start_node, a_network, a_nodes, a_edges, gScore, fScore, end_node, delay);
    return time;
}


/* Función principal que ejecuta algoritmo de A*
 * @param start_node: indica cual será el nodo de inicio del recorrido;
          recibido de html
 * @param a_network: grafo que se utilizará para ejecución de algoritmo;
          esto evita que se ejecuten comandos sobre otros algoritmos
 * @param a_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param a_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param gScore:
 * @param fScore:
 * @param end_node:
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
var current_weight;
var heuristics = 0;
async function AUtil(start_node, a_network, a_nodes, a_edges, gScore, fScore, end_node, delay)
{
    var a_result = "";

    document.getElementById("a-instruction").innerHTML = "openSet.push(nodo_inicial);<br>fScore[nodo_inicial]=h(nodo_inicial);<br>";

    if (delay > 100)
    {
        await sleep(1000);
    }

    var open_set = [];
    var close_set = [];
    var came_from = [];
    var getpath = [];

    var ti = performance.now(); // Obtención de tiempos ejecucion; NO TOCAR

    heuristics = h(start_node, end_node, a_network);
    open_set.push(start_node);

    gScore[start_node] = 0;
    fScore[start_node] = heuristics;

    let tempG = heuristics;
    var zero = 0;

    getpath.push({ now:start_node,heuristics, from:zero });

    while(open_set.length > 0)
    {
        var winner = 0;

        for (var i = 0; i < open_set.length; ++i)
        {
            if (fScore[i] < fScore[winner])
            {
                winner = i;
            }
        }

        var current = open_set[winner];
        var neighbors = a_network.getConnectedNodes(current);
        var edge_neighbors = a_network.getConnectedEdges(current);

        document.getElementById("a-instruction").innerHTML = "&emsp;for i in all neighbor(current)<br>&emsp;&emsp;new_gScore = gScore[current] + d(current, neighbor)<br>";

        if (current == end_node)
        {
            came_from.push(current);
            await sleep(delay * 1.5);
            markVisited_Node(current, a_nodes);
            highlightNode(current, a_nodes);

            a_result += current;
            a_result += "<br>";
            document.getElementById("a-result").innerHTML = a_result;

            console.log(getpath);

            draw_path(start_node,end_node,getpath);
            document.getElementById("a-instruction").innerHTML = "END";

            var tf = performance.now();
            var execution_time = tf - ti;
            document.getElementById("tiempo-a").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

            return 0;
        }
        document.getElementById("a-instruction").innerHTML = "while openSet IS NOT EMPTY<br>&emsp;current = lowest_f(openSet);<br>";
        await sleep(delay-50);

        remove_from_array(open_set, current);
        close_set.push(current);

        for (i = 0; i < neighbors.length; ++i)
        {
            var neighbor = neighbors[i];

            check_dir(current,neighbor);

            if (direction)
            {
                highlightNode(current, a_nodes);

                if (!close_set.includes(neighbor))
                {
                    get_weight(current,neighbor);
                    tempG = gScore[current] + current_weight;

                    // Is this a better path than before?
                    var newPath = false;
                    if (open_set.includes(neighbor))
                    {
                        if (tempG < gScore[neighbor])
                        {
                          gScore[neighbor] = tempG;
                          newPath = true;
                        }
                    } else
                    {
                        gScore[neighbor] = tempG;
                        newPath = true;
                        open_set.push(neighbor);
                    }

                    document.getElementById("a-instruction").innerHTML = "&emsp;&emsp;if new_gScore < gScore[neighbor]<br>&emsp;&emsp;&emsp;fScore[neighbor] = gScore[neighbor] + h(neighbor)<br>";

                    if (newPath)
                    {
                        // console.log("Debug");

                        fScore[neighbor] = tempG;

                        await sleep(delay * 1.5);
                        markVisited_Node(current, a_nodes);

                        check_dir(neighbor,current);
                        if (!direction)
                        {
                            highlightEdge(edge_neighbors[i], a_edges, a_nodes, a_network, current);
                        }
                        getpath.push({ now: neighbor, tempG, from: current });

                        fScore[neighbor] = gScore[neighbor] + h(neighbor, end_node, a_network);
                        if (!came_from.includes(current))
                        {
                            came_from.push(current);
                            a_result += current;
                            document.getElementById("a-result").innerHTML = a_result;
                        }
                        // highlightEdge(neighbor, a_edges, a_nodes, a_network,current);
                    }
                }
            } else { }
        }

        if (came_from.includes(current))
        {
          a_result += " -> ";
        }

        // else return no solution */
    }
    document.getElementById("a-instruction").innerHTML = "END";
    a_result = "No se puede acceder al grafo";
    document.getElementById("a-result").innerHTML = a_result;

    // Obtención tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-a").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
}


/*
 * @param start_node:
 * @param end_node:
 * @param array:
 */
async function draw_path(start_node, end_node, array)
{
    var end = end_node;
    var start = start_node;
    var temp = [];
    var print = "";
    var save;

    a_result += "<br>Camino Óptimo:<br>";

    array[0].tempG = 1;
    temp.push(end_node);

    for (var i = 0; i < array.length; ++i)
    {
        for (var j = 0; j < array.length; ++j)
        {
            if (array[j].now == end)
            {
                if (end == start_node)
                {
                    // temp.push(start_node);
                    temp = temp.reverse();

                    print += start;

                    for (var h = 1; h < temp.length; ++h)
                    {
                        print += "->";
                        print += temp[h];
                    }

                    a_result += print;
                    document.getElementById("a-result").innerHTML = a_result;

                    return;
                }
                save = array[j].tempG;
                end = array[j].from;

                for (var h = j; h < array.length; ++h)
                {
                    if (array[h].now == array[j].now)
                    {
                        if (array[h].tempG < save)
                        {
                            save = array[h].tempG;
                            end = array[h].from;
                        }
                    }
                }
                if (!temp.includes(end))
                {
                    console.log(end);
                    temp.push(end);
                }
            }
        }
    }
}


/*
 * @param start_node:
 * @param end_node:
 * @param network:
 */
async function h (start_node, end_node, network)
{
    var s = network.getPosition(start_node);
    var e = network.getPosition(end_node);

    var h = Math.round((Math.abs(s.x - e.x) + Math.abs(s.y - e.y)) / 60);
    return h;
}


/*
 * @param arr:
 * @param elt:
 */
async function remove_from_array(arr, elt)
{
    for (var i = arr.length - 1; i >= 0; --i)
    {
        if (arr[i] == elt)
        {
          arr.splice(i, 1);
        }
    }
}


/*
 * @param nodo:
 * @param nodo_end:
 */
async function get_weight(nodo, nodo_end)
{
    for (i = 0; i < edges_array.length; ++i)
    {
        if ((edges_array[i].from == nodo) && (edges_array[i].to == nodo_end))
        {
            current_weight = edges_array[i].weight;
            return;
        }
    }
}

/*
 * @param nodo:
 * @param nodo_end:
 */
async function check_dir(nodo, nodo_end)
{
    for (i = 0; i < edges_array.length; ++i)
    {
        if ((edges_array[i].from == nodo) && (edges_array[i].to == nodo_end))
        {
            direction = true;
            return;
        }
    }
    direction = false;
}


/* ---- Prim ----  // Gerry
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
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
    // Hasta aquí es el proceso para tener grafos independientes

    // Se obtiene el nodo de origen usansdo el id del input del html
    var start_node = parseInt(document.getElementById("origin-prim").value);

    // Se 'imprime' instrucción en ejecución
    document.getElementById("prim-instruction").innerHTML = "Prim("+start_node+");";

    var time = PrimUtil(start_node, prim_network, prim_nodes, prim_edges, delay);
    return time;
}


/* Función principal que ejecuta algoritmo de Prim
 * @param start_node: indica cual será el nodo de inicio del recorrido;
          recibido de html
 * @param prim_network: grafo que se utilizará para ejecución de algoritmo;
          esto evita que se ejecuten comandos sobre otros algoritmos
 * @param prim_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param prim_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
*/
async function PrimUtil(start_node, prim_network, prim_nodes, prim_edges, delay)
{
    var ti = performance.now();

    var mst = [];
    var prim_result = ""; // Tendrá el contenido del MST para mostrar en HTML
    var distance = [];
    var parent = [];
    var edges_recorridas = [];

    for (var i = 0; i < node_number; ++i)
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

    var queue = [];
    queue.push(start_node);
    highlightNode(start_node, prim_nodes);

    while (queue.length > 0)
    {
        document.getElementById("prim-instruction").innerHTML = "WHILE queue ≠ ∅ DO<br>";
        console.log("Queue while: " + queue);

        // Obtener el nodo que tenga la arista más corta
        var min = Infinity;
        var pos_min = 0, pos_edge = 0;
        for (var i = 0; i < queue.length; ++i)
        {
            console.log("For de: " + queue[i] + ", sacaremos sus edges.");
            var temp = prim_network.getConnectedEdges(queue[i]);

            for (var j = 0; j < temp.length; ++j)
            {
                console.log("prim_edges.get(temp[j]).from  = " + prim_edges.get(temp[j]).from);
                console.log("parent[queue[i] - 1]  = " + parent[queue[i] - 1]);
                if (prim_edges.get(temp[j]).from == parent[queue[i] - 1])
                {
                    if (parseInt(prim_edges.get(temp[j]).label) < min)
                    {
                        console.log(queue[i]+ "sutituyó min == " + min + " con un valor de : "+ prim_edges.get(temp[j]).label);
                        min = parseInt(prim_edges.get(temp[j]).label);
                        pos_min = i;
                        pos_edge = j;
                    }
                }
            }
        }

        var node_analized = queue[pos_min];
        console.log("Nodo analizado: " + node_analized);

        await sleep(delay * 1.5);
        markVisited_Node(node_analized, prim_nodes);
        queue.splice(pos_min, 1);
        // Fin Obtener el nodo que tenga la arista más corta

        if (parent[node_analized - 1] != node_analized)
        {
            mst.push[node_analized];
            prim_result += node_analized;
            document.getElementById("prim-result").innerHTML = prim_result;
            prim_result += " -> ";
        }

        var neighbors = prim_network.getConnectedEdges(node_analized);

        for (var i = 0; i < neighbors.length; ++i)
        {

            document.getElementById("prim-instruction").innerHTML = "FOR ALL {u, w} ∈ E do<br>";

            if (queue.indexOf(prim_edges.get(neighbors[i]).to) != -1)
            {
                if (parseInt(prim_edges.get(neighbors[i]).label) < distance[prim_edges.get(neighbors[i]).to - 1])
                {

                    document.getElementById("prim-instruction").innerHTML = "IF w ∈ queue AND l(u, w) < distance(w) THEN<br>&emsp;distance(w) ← l(u, w), parent(w) ← u<br>";

                    distance[prim_edges.get(neighbors[i]).to - 1] = parseInt(prim_edges.get(neighbors[i]).label);
                    parent[prim_edges.get(neighbors[i]).to - 1] = prim_edges.get(neighbors[i]).from;

                }
            } else if (parent[prim_edges.get(neighbors[i]).to - 1] == null)
            {

                document.getElementById("prim-instruction").innerHTML = "ELSE IF parent(w) = NULL THEN<br>&emsp;distance(w) ← l(u, w), parent(w) ← u<br>&emsp;queue.insert(w)<br>";

                distance[prim_edges.get(neighbors[i]).to - 1] = parseInt(prim_edges.get(neighbors[i]).label);
                parent[prim_edges.get(neighbors[i]).to - 1] = prim_edges.get(neighbors[i]).from;
                queue.push(prim_edges.get(neighbors[i]).to);

                highlightNode(prim_edges.get(neighbors[i]).to, prim_nodes);
            }
        }

        // Evita error de iluminar arista en 1era iteración:
        if (node_analized != start_node)
        {
            var dad = parent[node_analized - 1];
            var edge = prim_network.getConnectedEdges(dad);

            for (var i = 0; i < edge.length; ++i)
            {
                if (prim_edges.get(edge[i]).to == node_analized)
                {
                    highlightEdge(edge[i], prim_edges, prim_nodes, prim_network);
                    edges_recorridas.push(prim_edges.get(edge[i]).id);
                }
            }

        }
    }
    document.getElementById("prim-instruction").innerHTML = "END";

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-prim").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    // Elimina aristas que sobran
    ids_edges = [];
    for (var i = 0; i < edges_array.length; ++i)
    {
        ids_edges.push(edges_array[i].id);
        console.log("id: "+ids_edges[i]);
    }

    for (var i = 0; i < ids_edges.length; ++i)
    {
        if (!edges_recorridas.includes(ids_edges[i]))
        {
             dashEdge(ids_edges[i], prim_edges);
        }
    }

    return execution_time;
}


/* ---- Kruskal ----  // Gerry
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
function Kruskal(delay)
{
    // Algoritmo para desplegar en HTML
    var kruskal_code = "mst ← ∅<br>";
    kruskal_code += "queue_edges.sort(ascendente_peso);<br>";
    kruskal_code += "FOREACH nodo in grafo<br>";
    kruskal_code += "&emsp;&emsp;let disj_set = new DisjointSet([nodo1, nodo2, ..., nodo#]);<br>";
    kruskal_code += "WHILE queue_edges ≠ ∅ AND disj_set.count > 1 DO<br>";
    kruskal_code += "&emsp;&emsp;{u, v} ← queue.extractMin();<br>";
    kruskal_code += "&emsp;&emsp;IF !(mst ∪ {{u, v}} has cycle)<br>";
    kruskal_code += "&emsp;&emsp;&emsp;&emsp;mst.add({u, v});<br>";
    kruskal_code += "&emsp;&emsp;&emsp;&emsp;merge(disj_set-of(u), disj_set-of(v))<br>";
    kruskal_code += "END<br>";
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
    // Hasta aquí es el proceso para tener grafos independientes

    var time = KruskalUtil(kruskal_nodes, kruskal_edges, delay);
    return time;
}


/* Función principal que ejecuta algoritmo de Kruskal
 * @param kruskal_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param kruskal_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
async function KruskalUtil(kruskal_nodes, kruskal_edges, delay)
{
    kruskal_result = "";
    mst = [];

    nodos = [];
    edges_array.sort(function(a, b) { return (a.weight - b.weight) });
    for (var i = 0; i < node_number; ++i)
    {
      nodos[i] = i+1;
    }

    let disj_set = new DisjointSet(nodos);

    // document.getElementById("kruskal-instruction").innerHTML = "hola"+edges_array[0].from;
    var cont = 0;
    var aristas = edge_number;

    document.getElementById("kruskal-instruction").innerHTML = "mst ← ∅<br>queue_edges.sort(ascendente_peso);<br>FOREACH nodo in grafo<br>&emsp;&emsp;let disj_set = new DisjointSet([nodo1, nodo2, ..., nodo#]);<br>";
    await sleep(delay * 0.6);

    var ti = performance.now(); // Medición tiempo algoritmo

    while ((aristas > 0) && (disj_set.count > 1))
    {
        document.getElementById("kruskal-instruction").innerHTML = "WHILE queue_edges ≠ ∅ AND disj_set.count > 1 DO<br>&emsp;&emsp;{u, v} ← queue.extractMin();<br>";

        highlightEdge(edges_array[cont].id, kruskal_edges);
        await sleep(delay);

        if (!disj_set.connected(edges_array[cont].from, edges_array[cont].to))
        {
            document.getElementById("kruskal-instruction").innerHTML = "IF !(mst ∪ {{u, v}} has cycle)<br>&emsp;&emsp;mst.add({u, v});<br>&emsp;&emsp;merge(disj_set-of(u), disj_set-of(v))<br>";

            mst.push(edges_array[cont]);
            disj_set.union(edges_array[cont].from, edges_array[cont].to);
            aristas--;

            markVisited_Node(edges_array[cont].from, kruskal_nodes);
            markVisited_Node(edges_array[cont].to, kruskal_nodes);
            kruskal_result += "(De: " + edges_array[cont].from + ", a: " + edges_array[cont].to + ", p: " + edges_array[cont].weight + ")";
            document.getElementById("kruskal-result").innerHTML = kruskal_result;
            await sleep(delay);

            kruskal_result += "<br>";
        } else
        {
            document.getElementById("kruskal-instruction").innerHTML = "ELSE REMOVE EDGE<br>";

            resetAnimation_Edge(edges_array[cont].id, kruskal_edges);
            dashEdge(edges_array[cont].id, kruskal_edges);
            await sleep(delay);
        }
        cont++;
    }

    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-kruskal").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    document.getElementById("kruskal-instruction").innerHTML = "END";

    // Elimina aristas restantes
    for ( ; cont < edges_array.length; ++cont)
    {
        dashEdge(edges_array[cont].id, kruskal_edges);
    }

    return execution_time;
}


/* ---- Dijkstra ----  // Rojo
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
function Dijkstra(delay)
{
    console.log("flag Dijkstra");
    // Algoritmo para desplegar en HTML
    var dijkstra_code = "var visitados[]; <br>";
    dijkstra_code += "var toAnalize[]; <br>";
    dijkstra_code += "var Tabla[]; <br>";
    dijkstra_code += "var Padres[]; <br>";
    dijkstra_code += "BEGIN <br>";

    dijkstra_code += "FOR i = 1,....,n DO <br>";
    dijkstra_code += "&emsp;Peso[i] <- infinity, Padres[i] <- infinity <br>";
    dijkstra_code += "Tabla[Origen] <- 0 <br>";
    dijkstra_code += "queue.insert(Origen) <br>";
    dijkstra_code += "WHILE visitados != num_nodos DO <br>";
    dijkstra_code += "&emsp;node_analized <- queue.extract() <br>";
    dijkstra_code += "&emsp;FOR ALL (node_analized,destino) DO<br>";
    dijkstra_code += "&emsp;&emsp;IF Tabla[destino] > destino.peso+Tabla[node_analized] <br>";
    dijkstra_code += "&emsp;&emsp;&emsp;Tabla[destino]<-destino.peso+Tabla[node_analized], Padres[destino]<-node_analized <br>";
    dijkstra_code += "&emsp;&emsp;IF destino IS NOT IN visitados AND destino IS NOT IN toAnalize <br>";
    dijkstra_code += "&emsp;&emsp;&emsp;toAnalize.insert(destino)<br>";
    dijkstra_code += "&emsp;IF toAnalize IS EMPTY <br>";
    dijkstra_code += "&emsp;&emsp;BREAK;<br>";
    dijkstra_code += "&emsp;queue.insert(toAnalize.extractMin),visited.insert(toAnalize.extractMin)<br>";
    dijkstra_code += "END <br>";
    document.getElementById("dijkstra-code").innerHTML = dijkstra_code;

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
    // Hasta aquí es el proceso para tener grafos independientes

    var Tabla = [node_number - 1];
    var Padres = [node_number - 1];
    // Array Tabla para los pesos de los nodos y Padres para sus respectivos descendientes

    for (var i = 0; i < node_number; ++i)
    {
        Tabla[i] = Infinity;
        Padres[i] = Infinity;
    }
    // Se 'imprime' instrucción en ejecución
    document.getElementById("dijkstra-instruction").innerHTML = "FOR i = 1,....,n DO <br> &emsp;Peso[i] <- infinity, Padres[i] <- infinity <br>";

    // Se obtiene el nodo de origen usansdo el id del input
    // (todos son 'origin-algoritmo' -> checar html para obtener ids)
    var start_node = parseInt(document.getElementById("origin-dijkstra").value); // En algunos algoritmos no se necesitará esto
    var target_node = parseInt(document.getElementById("target-dijkstra").value);

    var time = DijkstraUtil(start_node, target_node, dijkstra_network, dij_nodes, dij_edges, Tabla, Padres, delay);
    return time;
}


/* Función principal que ejecuta algoritmo de Dijkstra
 * @param start_node: indica cual será el nodo de inicio del recorrido;
          recibido de html
* @param target_node: indica cial será el nodo destino de recorrido;
        recibido por html
 * @param dijkstra_network: grafo que se utilizará para ejecución de algoritmo;
          esto evita que se ejecuten comandos sobre otros algoritmos
 * @param dij_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param dij_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param Tabla: Array donde se almacenan los pesos acumulados de cada nodo
 * @param Padres: Array donde se almacenan los predecesores de cada nodo
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
async function DijkstraUtil(start_node, target_node, dijkstra_network, dij_nodes, dij_edges, Tabla, Padres, delay)
{
    // Obtención tiempos ejecucion; NO TOCAR
    var ti = performance.now();

    var dijkstra_sol = "";
    var visited = [];
    var toAnalize = [];
    var queue = new Queue();

    visited.push(start_node);
    queue.enqueue(start_node);

    console.log(Aristas.length);

    Tabla[start_node - 1] = 0;

    document.getElementById("dijkstra-instruction").innerHTML = "Tabla["+start_node-1+"] <- 0";
    document.getElementById("dijkstra-instruction").innerHTML = "queue.insert("+start_node+")";

    while (visited.length != node_number)
    {
        document.getElementById("dijkstra-instruction").innerHTML = "WHILE visitados != "+node_number+" DO";

        var node_analized = queue.dequeue();
        console.log(node_analized);
        await  markVisited_Node(node_analized, dij_nodes, delay);

        document.getElementById("dijkstra-instruction").innerHTML = "node_analized <- "+ node_analized + "<br> FOR ALL (node_analized,destino) DO";

        await sleep(delay * 1.5);
        markVisited_Node(node_analized, dij_nodes);
        await sleep(delay);

        for (var i = 0; i < Aristas.length; ++i)
        {
            if (Aristas[i].origen == node_analized)
            {
                var flag = true;

                /* Se Comprueba si el peso en los nodos destino requieren de una actualización */
                document.getElementById("dijkstra-instruction").innerHTML = "IF "+Tabla[Aristas[i].destino-1]+" > "+ Aristas[i].peso + Tabla[node_analized - 1];

                if (Tabla[Aristas[i].destino - 1] > Aristas[i].peso + Tabla[node_analized - 1])
                {
                    Tabla[Aristas[i].destino - 1] = Aristas[i].peso + Tabla[node_analized - 1];
                    Padres[[Aristas[i].destino - 1]] = node_analized;
                    document.getElementById("dijkstra-instruction").innerHTML = "Tabla["+Aristas[i].destino - 1+"] <- "+Aristas[i].peso + Tabla[node_analized - 1]+" , "+ "Padres["+Aristas[i].destino - 1+"]<-"+node_analized;

                    /* Comprueba si el nodo ya fue analizado o no */
                    for (var j = 0; j < visited.length; ++j)
                    {
                        if (Aristas[i].destino == visited[j]||Aristas[i].destino==toAnalize[j])
                        {
                            flag = false;
                            break;
                        }
                    }

                    document.getElementById("dijkstra-instruction").innerHTML = "IF destino IS NOT IN visitados AND destino IS NOT IN toAnalize"
                    if (flag)
                    {
                        document.getElementById("dijkstra-instruction").innerHTML ="toAnalize.insert("+Aristas[i].destino+")";
                        toAnalize.push(Aristas[i].destino);
                        highlightNode(Aristas[i].destino, dij_nodes);
                        highlightEdge(Aristas[i].ID, dij_edges, dij_nodes, dijkstra_network);
                    }
                    else {
                        dashEdge(Aristas[i].ID,dij_edges);
                    }
                }
                else {
                    dashEdge(Aristas[i].ID,dij_edges);
                }
            }
        }

        document.getElementById("dijkstra-instruction").innerHTML = "IF toAnalize = 0";

        if (toAnalize.length == 0)
        {
            console.log("???");
            document.getElementById("dijkstra-instruction").innerHTML = "END";
            break;
        }

        // Variables auxiliares para detectar el menor peso dentro de los nodos que no se han analizado
        var peso_mínimo = Infinity;
        var min = Infinity;
        var aux;

        /* De los nodos que se han descubierto, selecciona el de menor peso */
        for (var i = 0; i < toAnalize.length; ++i)
        {
            if ((Tabla[toAnalize[i] - 1]) < peso_mínimo)
            {
                peso_mínimo = Tabla[toAnalize[i] - 1];
                min = toAnalize[i];
                aux = i;
            }
        }
        /* Se agrega el nodo a los analizados, se elimina
        de los posibles a analizar y se agrega a la cola
        para ser analizado en la siguiente iteración */

        document.getElementById("dijkstra-instruction").innerHTML ="queue.insert("+min+") , "+"visited.insert("+min+")";

        visited.push(min);
        toAnalize.splice(aux, 1);
        queue.enqueue(min);
    }
    var str;
    str=" ";
    Padres.forEach(element => {
        str+=" "+element;
    });
    console.log("PAdres: "+str);
    str=" ";
    Tabla.forEach(element => {
        str+=" "+element;
    });
    console.log("PESOS: "+str);


    /* Detecta si existe o no el camino mediante la tabla de pesos */
    if (Tabla[target_node - 1] == Infinity)
    {
        dijkstra_sol = "No hay un camino hacia ese nodo";
    } else
    {
        var padre = Padres[target_node - 1];
        var path = target_node;
        var cont = 0;

        /* Ciclo que construye el path a través de las posiciones de los padres */
        while (padre != start_node && start_node != target_node)
        {
            path = padre + " -> " + path;
            padre = Padres[padre - 1];
            cont++;
        }
        path = start_node + " -> " + path;
        dijkstra_sol = path + "<br>" + "Distancia: " + Tabla[target_node - 1];
    }
    document.getElementById("dijkstra-result").innerHTML = dijkstra_sol;

    // Obtención tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-dijkstra").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    return execution_time;
}


/* ---- Bellman-Ford ---- // Rojo

 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
function Belford(delay)
{
    // Algoritmo para desplegar en HTML
    console.log("Bellford");
    document.getElementById("belford-result").innerHTML = " ";
    var bellman_code = "var Tabla[]; <br>";
    bellman_code += "var Padres[]; <br>";
    bellman_code += "BEGIN <br>";

    bellman_code += "FOR i = 1,....,n DO <br>";
    bellman_code += "&emsp;Peso[i] <- infinity, Padres[i] <- infinity <br>";
    bellman_code += "Tabla[Origen] <- 0 <br>";
    bellman_code += "FOR i= 1....,num_nodos DO <br>";
    bellman_code += "&emsp;FOR ALL (node_analized,destino) DO<br>";
    bellman_code += "&emsp;&emsp;IF Tabla[destino] > destino.peso+ Tabla[node_analized] <br>";
    bellman_code += "&emsp;&emsp;&emsp;Tabla[destino]<-destino.peso+Tabla[node_analized], Padres[destino]<-node_analized <br>";
    bellman_code += "&emsp;FOR ALL (node_analized,destino) DO<br>";
    bellman_code += "&emsp;&emsp;IF Tabla[destino] > destino.peso+ Tabla[node_analized] <br>";
    bellman_code += "&emsp;&emsp;&emsp;ciclo_negativo <- true, BREAK <br>";
    bellman_code += "END <br>";
    document.getElementById("belford-code").innerHTML = bellman_code;
    

    // Se obtiene el nodo de origen usansdo el id del input
    // (todos son 'origin-algoritmo' -> checar html para obtener ids)
    var start_node = parseInt(document.getElementById("origin-belford").value);
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
    var options = { };
    var belford_network = new vis.Network(container, data, options);
    // Hasta aquí es el proceso para tener grafos independientes

    var Tabla = [node_number - 1];
    var Padres = [node_number - 1];
    // Array Tabla para los pesos de los nodos y Padres para sus respectivos descendientes
    var visited = [];
    document.getElementById("belford-instruction").innerHTML = "BEGIN";
    document.getElementById("belford-instruction").innerHTML = "FOR i = 1,....,n DO";
    for (var i = 0; i < node_number; ++i)
    {
        Tabla[i] = Infinity;
        Padres[i] = Infinity;
        visited[i]= i + 1;
    }
    document.getElementById("belford-instruction").innerHTML = "Tabla[i] <- infinity, Padres[i] <- infinity,";


    var time = BelfordUtil(start_node, target_node, belford_network, bel_nodes, bel_edges, Tabla, Padres, visited, delay);
    return time;
}

/* Función principal que ejecuta algoritmo de Bellman-Ford
 * @param start_node: indica cual será el nodo de inicio del recorrido;
          recibido de html
* @param target_node: indica cial será el nodo destino de recorrido;
        recibido por html
 * @param belfordnetwork: grafo que se utilizará para ejecución de algoritmo;
          esto evita que se ejecuten comandos sobre otros algoritmos
 * @param bel_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param bel_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param Tabla: Array donde se almacenan los pesos acumulados de cada nodo
 * @param Padres: Array donde se almacenan los predecesores de cada nodo
 * @param visited: Array donde se almacenan los nodos que se analizan
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
async function BelfordUtil(start_node, target_node, belfordnetwork, bel_nodes, bel_edges, Tabla, Padres, visited,delay)
{
    var ti = performance.now();
    
    visited.splice(start_node - 1, 1);
    visited.unshift(start_node);

    Tabla[start_node - 1] = 0;

    document.getElementById("belford-instruction").innerHTML = "FOR i= 1....,"+(node_number -1)+ " DO";
    
    for (var i = 0; i < node_number - 1; ++i)
    {
        cleanGraph(bel_nodes, bel_edges);
        for (var j = 0;j < visited.length; ++j)
        {
            await sleep(delay * 1.5);
            markVisited_Node(visited[j], bel_nodes);
           await sleep(delay);
            document.getElementById("belford-instruction").innerHTML = "FOR ALL (Aristas,origen,destino) DO";
            for (var k=0;k<Aristas.length;++k)
            {
                if (Aristas[k].origen==visited[j])
                {
                    highlightEdge(Aristas[k].ID, bel_edges);
                    await sleep(delay);
                    document.getElementById("belford-instruction").innerHTML = "Tabla["+(Aristas[k].destino - 1)+"]> "+Aristas[k].peso +" + Tabla["+(Aristas[k].origen- 1)+"]";
                    if ( Tabla[Aristas[k].destino - 1] > Aristas[k].peso + Tabla[Aristas[k].origen - 1])
                    {
                        Tabla[Aristas[k].destino-1] = Aristas[k].peso + Tabla[Aristas[k].origen - 1];
                        Padres[[Aristas[k].destino - 1]] = Aristas[k].origen;
                        document.getElementById("belford-instruction").innerHTML = "IF Tabla["+(Aristas[k].destino - 1)+"] <- "+Aristas[k].peso +" + Tabla["+(Aristas[k].origen- 1)+"], Padres["+(Aristas[k].destino - 1)+"] <- "+(Aristas[k].origen - 1);

                    }
                }
            }
        
        }

    }

    var ciclo_n = false;
    // Hace una iteración mas para comprobar si hay o no un ciclo negativo
    for (var j = 0; j < visited.length; ++j)
    {
        await sleep(delay * 1.5);
        markVisited_Node(visited[j], bel_nodes);
        await sleep(delay);
        document.getElementById("belford-instruction").innerHTML = "FOR ALL (Aristas,origen,destino) DO";
        for (var k = 0; k < Aristas.length; ++k)
        {
            if (Aristas[k].origen == visited[j])
            {
                highlightEdge(Aristas[k].ID, bel_edges,bel_nodes,belfordnetwork,-1);
                await sleep(delay);
                document.getElementById("belford-instruction").innerHTML = "IF Tabla["+(Aristas[k].destino - 1)+"]> "+Aristas[k].peso +" + Tabla["+(Aristas[k].origen- 1)+"]";
                if (Tabla[Aristas[k].destino - 1] > (Aristas[k].peso + Tabla[[Aristas[k].origen] - 1])){
                    ciclo_n = true;
                    document.getElementById("belford-instruction").innerHTML = "ciclo_negativo <- true , BREAK";
                    break;
                }
            }
        }
        if (ciclo_n) { break; }
    }
    if (ciclo_n)
    {
        Bellman_sol = "Hay un ciclo negativo, no existe solución";
    }
    else if (Tabla[target_node - 1] == Infinity)
    {
        document.getElementById("belford-instruction").innerHTML = "END";
        Bellman_sol = "No hay un camino hacia ese nodo";
    } else
    {
        document.getElementById("belford-instruction").innerHTML = "END";
        var padre = Padres[target_node - 1];
        var path = target_node;
        var cont = 0;

        /* Ciclo que construye el path a través de las posiciones de los padres */
        while (padre != start_node && start_node != target_node)
        {

            path = padre + " -> " + path;
            padre = Padres[padre - 1];
            cont++;
        }
        path = start_node + " -> " + path;
        Bellman_sol = path + "<br>" + "Distancia: " + Tabla[target_node - 1];
    }

    document.getElementById("belford-result").innerHTML = Bellman_sol;

    // Obtención tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-belford").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
    return execution_time;
}

/* ---- Floyd-Warshall ---- // Rojo

 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
var floyd_code;
function Floyd(delay)
{
    // Algoritmo para desplegar en HTML
    var floyd_code = "";
    console.log("Floyd");
    floyd_code += "var distancias[][]; <br>"
    floyd_code += "BEGIN <br>";
    floyd_code += "FOR i= 0....,n Do <br>";
    floyd_code += "&emsp;FOR j= 0....,n Do <br>";
    floyd_code += "&emsp;&emsp;IF i=j <br>";
    floyd_code += "&emsp;&emsp;&emsp;distancias[i][j] <- 0 <br>";
    floyd_code += "&emsp;&emsp;ELSE IF Aristas(i,j) EXISTS <br>";
    floyd_code += "&emsp;&emsp;&emsp;distancias[i][j] <- Aristas(i,j).Peso <br>";
    floyd_code += "&emsp;&emsp;ELSE <br>";
    floyd_code += "&emsp;&emsp;&emsp;distancias[i][j] <- Infinity <br>";

    floyd_code += "FOR k= 0....,n Do <br>";
    floyd_code += "&emsp;FOR i= 0....,n Do <br>";
    floyd_code += "&emsp;&emsp;FOR j= 0....,n Do <br>";
    floyd_code += "&emsp;&emsp;&emsp;IF if (distancias[i][j] > distancias[i][k] + distancias[k][j]) <br>";
    floyd_code += "&emsp;&emsp;&emsp;&emsp;distancias[i][j] <- distancias[i][k] + distancias[k][j] <br>";
    floyd_code += "END <br>";
    document.getElementById("floyd-code").innerHTML = floyd_code;

    // Se tiene que volver a hacer un dibujo del grafo
    // para tener animaciones individuales
    var floyd_nodes = new vis.DataSet(nodes.get()); // Se hace una copia de los nodos y aristas
    var floyd_edges = new vis.DataSet(edges.get());
    var container = document.getElementById('floyd-network'); // Se hace la liga al contenedor del html respectivo a cada algoritmo (todos son 'algoritmo-network' -> checar html para obtener ids)
    var data = {
        nodes: floyd_nodes,
        edges: floyd_edges
    };
    var options = { };
    var floyd_network = new vis.Network(container, data, options);
    // Hasta aquí es el proceso para tener grafos independientes

    /* Proceso de creacion de matriz de adyacencia inicial */

    // Se crea la matriz de adyacencia con valores infinitos y diagonal principal con valores de cero
    var dist = [];
    for (var i = 0; i < node_number; i += 1)
    {
        dist[i] = [];
        for (var j = 0; j < node_number; ++j)
        {
            if (i==j)
                dist[i][j]=0;
            else
                dist[i][j]=Infinity;
        }
    }
    // Se llena la matriz de acuerdo a los pesos de sus aristas
    for (var i = 0; i < node_number; i += 1) {
        for (var j=0;j<node_number;++j) {
            for (var k=0;k<Aristas.length;++k) {
                if (Aristas[k].origen==i+1&&Aristas[k].destino==j+1) {
                    dist[i][j]=Aristas[k].peso;
                }
            }
        }
    }
    // Fin inicializaciÓn de matriz

    var time = FloydUtil(floyd_nodes, floyd_edges, dist, delay);

  return time;
}


/* Función principal que ejecuta algoritmo de Floyd-Warshall
 * @param floyd_nodes: grupo de nodos sobre el cual se ejecutan comandos
 * @param floyd_edges: grupo de aristas sobre el cual se ejecutan comandos
 * @param dist: Matriz de adyacencia
 * @param delay: cantidad de milisegundos que se hará el atraso;
          recibido de html y funciona para correr algoritmo rapido o lento
 */
async function FloydUtil(floyd_nodes, floyd_edges, dist, delay)
{
    // Obtención tiempos ejecucion; NO TOCAR
    var ti = performance.now();

    var result = " ";
    document.getElementById("floyd-result").innerHTML = result;
    document.getElementById("floyd-instruction").innerHTML ="FOR k= 0....,"+(node_number-1) +" Do";
    document.getElementById("floyd-instruction").innerHTML ="FOR i= 0....,"+(node_number-1) +" Do";
    document.getElementById("floyd-instruction").innerHTML ="FOR j= 0....,"+(node_number-1) +" Do";

    /* Ciclos anidados para analizar la distancia pasando por un nodo intermedio */
    for (var k = 0; k < node_number; ++k) {
        for (var i = 0; i < node_number; ++i) {
            if (k != i) { // No se analiza esta posición k=i porque los pesos serían iguales

                await sleep(delay*1.5);
                markVisited_Node(i+1,floyd_nodes);
                await sleep(delay);
                highlightNode(k+1,floyd_nodes);

                for (var j = 0; j < node_number; ++j) {
                    var flag = true;
                    if ((j != i) && (j != k)) { // No se analiza esta posición j=i y j=k porque los pesos serían iguales
                        for (var n = 0; n < Aristas.length; ++n) {

                            if ((Aristas[n].origen == i + 1) && (Aristas[n].destino == j + 1)) {
                                highlightEdge(Aristas[n].ID, floyd_edges);
                                var flag = false;
                            }
                            if ((Aristas[n].origen == k + 1) && (Aristas[n].destino == j + 1)) {
                                highlightEdge(Aristas[n].ID, floyd_edges);
                                var flag = false;
                            }
                        }
                        if (flag) {
                            // await sleep(delay*1.5);
                            dashNode(j + 1, floyd_nodes);
                            await sleep(delay);
                        } else {
                           // await sleep(delay*1.5);
                            markVisited_Node(j + 1, floyd_nodes);
                            await sleep(delay);
                        }
                        // Se comparan el peso del nodo actual al destino y el peso pasando por el nodo intermedio
                        document.getElementById("floyd-instruction").innerHTML ="IF (distancias["+i+"]["+j+"] > distancias["+i+"]["+k+"] + distancias["+k+"]["+j+"])";
                        if (dist[i][j] > dist[i][k] + dist[k][j]) {
                            document.getElementById("floyd-instruction").innerHTML ="distancias["+i+"]["+j+"] <- distancias["+i+"]["+k+"] + distancias["+k+"]["+j+"]";
                            dist[i][j] = dist[i][k] + dist[k][j];
                        }
                    }
                }
            }
            cleanGraph(floyd_nodes,floyd_edges);
        }
    }
    /* Impresión de los caminos mínimos  */
    for (var i = 0; i < dist.length; ++i) {
        for (var j = 0; j < dist.length; ++j) {
            result += "Camino mínimo del nodo "+(i+1)+" al nodo "+(j+1)+" es: "+dist[i][j]+"<br>";
        }
        result+="<br>";
    }
    document.getElementById("floyd-instruction").innerHTML ="END";
    document.getElementById("floyd-result").innerHTML=result;

    // Obtención tiempos ejecucion; NO TOCAR
    var tf = performance.now();
    var execution_time = tf - ti;
    document.getElementById("tiempo-floyd").innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";

    return execution_time;
}


/* -------------------------------------------------------------------------- */
/* --------------------- TEST DE GRÁFICAS ------------------------ */
var chart;
$('#exportar_pdf').click(function ()
{
    chart.exportChart({
        type: 'application/pdf',
        filename: 'my-pdf'
    });
});


async function test_graph()
{
    chart = Highcharts.chart('grafico-algoritmos',
    {
        chart: { type: 'bar' },
        title: { text: 'Tiempos de Comparación' },
        xAxis: { categories:categories_graph },
        yAxis: { title: { text: 'Milisegundos' } },
        series: [ { name: 'Grafo 1', data: dataGraph } ],
        exporting: {
            csv: {
                columnHeaderFormatter: function(item, key)
                {
                    if (item.name)
                    {
                      return item.name
                    }
                    return item.bar
                },
                lineDelimiter: '\n'
            }
        }
    });
}


function downlaodCsv() { chart.downloadCSV() }


/* -------------------------------------------------------------------------- */
/* --------------------- COMPARACIONES (PARALELISMO) ------------------------ */

/* Todos las funciones que se ejecutan cuando se corre
 * un algoritmo desde la sección de comparación
 */
async function runAlgorithm(algorithm)
{
    var algorithm_checkbox = "compare-" + algorithm;
    var bar_id = "bar-" + algorithm;
    var time_id = "medicion-" + algorithm;
    var execution_time = 0;

    var progress_bar = document.getElementById(bar_id);
    progress_bar.style.width = "1%";
    progress_bar.innerHTML  = "";

    document.getElementById(time_id).innerHTML = "0.00 milisegundos"

    document.getElementById("origin-"+algorithm).value = parseInt(document.getElementById("origin-all").value);

    if (document.getElementById(algorithm_checkbox).checked)
    {
        var ti = performance.now();

        switch(algorithm)
        {
            case "dfs":
                load_progressBar(algorithm, 60);
                await DFS(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("DFS");
                check_check_box = true;
                break;
            case "bfs":
                load_progressBar(algorithm, 60);
                await BFS(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("BFS");
                check_check_box = true;
                break;
            case "a":
                document.getElementById("end-a").value = parseInt(document.getElementById("target-all").value);
                load_progressBar(algorithm, 60);
                await A_star(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("A*");
                check_check_box = true;
                break;
            case "prim":
                load_progressBar(algorithm, 60);
                await Prim(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("Prim");
                check_check_box = true;
                break;
            case "kruskal":
                load_progressBar(algorithm, 60);
                await Kruskal(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("Kruskal");
                check_check_box = true;
                break;
            case "dijkstra":
                document.getElementById("target-dijkstra").value = parseInt(document.getElementById("target-all").value);
                load_progressBar(algorithm, 60);
                await Dijkstra(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("Dijkstra");
                check_check_box = true;
                break;
            case "belford":
                document.getElementById("target-belford").value = parseInt(document.getElementById("target-all").value);
                load_progressBar(algorithm, 60);
                await Belford(50);
                load_progressBar(algorithm, 100);
                categories_graph.push("Belford");
                check_check_box = true;
                break;
            case "floyd":
                // Ingresar código del algoritmo con velocidad normal

                categories_graph.push("Floyd");
                check_check_box = true;
                break;
        }

        var tf = performance.now()
        execution_time = tf - ti;

        document.getElementById(time_id).innerHTML = Number((execution_time).toFixed(2)) + " milisegundos";
        if (check_check_box)
        {
            dataGraph.push(execution_time);
        }

    }
    test_graph();
}

/* Ejecuta todos los algoritmos seleccionados en la sección de comparación */
function compareAlgorithms()
{
    dataGraph.length = 0;
    categories_graph.length = 0;
    /* Paralelización: sirve, pero no para esto (no puede hacer métodos para accesar al HTML) */
    // var p = new Parallel(["dfs", "bfs", "a", "prim", "kruskal", "dijkstra", "belford", "floyd"], {evalPath: './eval.js'});
    // console.log(p.data);
    // p.map(runAlgorithm);

    // Estas llamadas son las que debemos paralelizar
    runAlgorithm("dfs");
    runAlgorithm("bfs");
    runAlgorithm("a");
    runAlgorithm("prim");
    runAlgorithm("kruskal");
    runAlgorithm("dijkstra");
    runAlgorithm("belford");
    runAlgorithm("floyd");
    // Se genera la gráfica
}

/* ---- "MAIN" ---- */
drawRandomGraph();
