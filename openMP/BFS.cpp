#include <iostream>
#include <list>
#include <omp.h>

using namespace std;

/* Clase que crea grafo no dirigido, no ponderado */
class Graph
{
    int V;

    // Apuntador a las listas de adyacencia
    list<int> *adj;
public:
    /* Método constructor de la Clase
     * @param V: definirá la cantidad de nodos que tendrá el grafo
     */
    Graph(int V);

    /* Agrega aristas al grafo
     * @param v: nodo origen
     * @param uw: nodo destino
     */
    void addEdge(int v, int w);

    /* Realiza recorrido transversal del grafo (por amplitud) e imprime recorrido
     * @param s: nodo por el cual iniciará el recorrido
     */
    void BFS(int s);
};


Graph::Graph(int V)
{
    this->V = V;
    adj = new list<int>[V];
}


void Graph::addEdge(int v, int w)
{
    adj[v].push_back(w);
}


void Graph::BFS(int s)
{
    bool *visited = new bool[V];
    for(int i = 0; i < V; i++)
        visited[i] = false;

    list<int> queue;

    visited[s] = true;
    queue.push_back(s);

    list<int>::iterator i;

    printf("Camino: ");
    while(!queue.empty())
    {
        s = queue.front();
        printf("%d ", s);
        queue.pop_front();

        // Obtiene todos los adyacentes, aquellos no visitados entran al queue
        // y se marcan como visitados
        #pragma omp parallel num_threads(4)
        {
            for (i = adj[s].begin(); i != adj[s].end(); ++i)
            {
                // printf("For: %d", omp_get_thread_num());
                if (!visited[*i])
                {
                    // printf("if: %d", omp_get_thread_num());
                    visited[*i] = true;
                    queue.push_back(*i);
                }
            }
        }
    }
    printf("\n");
}


int main()
{
    Graph g(15);
    g.addEdge(3, 2);
    g.addEdge(3, 7);
    g.addEdge(2, 8);
    g.addEdge(2, 1);
    g.addEdge(7, 6);
    g.addEdge(7, 8);
    g.addEdge(7, 14);
    g.addEdge(8, 10);
    g.addEdge(8, 6);
    g.addEdge(1, 4);
    g.addEdge(1, 5);
    g.addEdge(6, 9);
    g.addEdge(14, 10);
    g.addEdge(10, 12);
    g.addEdge(10, 11);
    g.addEdge(5, 11);
    g.addEdge(9, 8);
    g.addEdge(11, 13);

    g.BFS(3);

    return 0;
}
