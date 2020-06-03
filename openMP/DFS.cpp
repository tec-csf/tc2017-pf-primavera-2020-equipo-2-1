/*
------------------------- ALGORITMO DFS -------------------------
    Paralelización en C++
-----------------------------------------------------------------
Par el algoritmo DFS, a pesar de ser implementado iterativamente
resulta complicado paralelizar algo más aparte de el analizis de
nodos adyacentes debido a que, por la naturaleza del algoritmo, 
el análisis de sus pasos depende de las llamadas anteriores, lo
cual resulta en una imposibilidad del algoritmo. 
-----------------------------------------------------------------
*/
#include <omp.h>
#include <bits/stdc++.h> 
using namespace std; 

/* Grafo usando lista de ayacencia */
class Graph { 
	int V;
	list<int> *adj;
public: 
	Graph(int V) { 
        this->V = V; 
        adj = new list<int>[V+1]; 
    } 

    void addEdge(int v, int w) { 
        adj[v].push_back(w); 
    } 

    /* Función de algoritmo DFS implementada en C++
    * @param s: nodo de origen tomado por el algoritmo
    */
    void DFS(int s) { 
        vector<bool> visited(V, false); 
        stack<int> stack; 
    
        stack.push(s); 
    
        while (!stack.empty()) { 
            s = stack.top(); 
            stack.pop(); 

            if (!visited[s]) { 
                cout << " -> " << s; 
                visited[s] = true; 
            } 
        
            // Directiva para poder paralelizar un for que itera sobre apuntadores.
            #pragma omp parallel num_threads(4)
            {
                for (auto i = adj[s].begin(); i != adj[s].end(); ++i) {
                    if (!visited[*i]) {
                        #pragma omp critical
                        {
                            stack.push(*i); //Sección critica, se modifica el contenido de una variable externa a la region paralela
                        }
                    }
                } 
            }
        } 
        cout<<endl;
    } 
}; 

int main() 
{ 
	Graph graph(14); 
    graph.addEdge(3, 2);
    graph.addEdge(3, 7);
    graph.addEdge(2, 8);
    graph.addEdge(2, 1);
    graph.addEdge(7, 6);
    graph.addEdge(7, 8);
    graph.addEdge(7, 14);
    graph.addEdge(8, 10);
    graph.addEdge(8, 6);
    graph.addEdge(1, 4);
    graph.addEdge(1, 5);
    graph.addEdge(6, 9);
    graph.addEdge(14, 10);
    graph.addEdge(10, 12);
    graph.addEdge(10, 11);
    graph.addEdge(5, 11);
    graph.addEdge(9, 8);
    graph.addEdge(11, 13);

	cout << "Recorrido DFS" << endl; 
	graph.DFS(3); 

	return 0; 
} 
