#include <cstdio>
#include <vector>
#include <set>
#include <chrono>
#include <queue>
// #include <omp.h>

using namespace std;

typedef pair<int, int> parN;

#define INF 1000

int node_number, edge_number = 0;


class DisjSet {
	int *rank, *parent, n;

public:
	// Constructor to create and
	// initialize sets of n items
	DisjSet(int n) {
		rank = new int[n];
		parent = new int[n];
		this->n = n;
		makeSet();
	}

  int size() {
    return n;
  }

	// Creates n single item sets
	void makeSet() {
		for (int i = 0; i < n; i++) {
			parent[i] = i;
		}
	}

	// Finds set of given item x
	int find(int x) {
		if (parent[x] != x) {
			parent[x] = find(parent[x]);
		}

		return parent[x];
	}

	// Do union of two sets represented
	// by x and y.
	void Union(int x, int y) {
		int xset = find(x);
		int yset = find(y);

		if (xset == yset)
			return;

		if (rank[xset] < rank[yset]) {
			parent[xset] = yset;
		}
		else if (rank[xset] > rank[yset]) {
			parent[yset] = xset;
		}	else {
			parent[yset] = xset;
			rank[xset] = rank[xset] + 1;
		}
    n -= 1;
	}

  bool connected(int a, int b) {
       return find(a) == find(b);
  }
};


bool asc_peso(const pair<parN, int> &a,
              const pair<parN, int> &b)
{
    int num_grande = 1000;
		if (a.second == b.second)
		{
				return (a.first.first * num_grande + a.first.second < b.first.first * num_grande + b.first.second);
		}
    return ((a.second < b.second));
}

void DFSUtil(int start_node, set<int> nodes, vector< pair<parN, int> > edges)
{
		auto start = chrono::high_resolution_clock::now();

		auto stop = chrono::high_resolution_clock::now(); // Aqui se guarda el tiempo en ese momento
    auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);

    printf("DFS tardó %lld microsegundos\n", duration.count());
}


void BFSUtil(int start_node, set<int> nodes, vector< pair<parN, int> > edges)
{
		auto start = chrono::high_resolution_clock::now();



    bool visited[node_number];
    for (var i = 0; i < node_number; ++i) {
        visited[i] = false;
		}

		vector<int> bfs_result;
		queue<int> queue;
    visited[start_node - 1] = true;

    queue.push(start_node);
    while (!queue.empty())
    {
				int node_analized = queue.pop();

        bfs_result.push_back(node_analized);
				printf("%d", bfs_result);

        visited[node_analized - 1] = true;



				for (i = adj[s].begin(); i != adj[s].end(); ++i)
        {
            if (!visited[*i]) 
            {
                visited[*i] = true;
                queue.push_back(*i);
            }
        }



        var temp_queue = [];
        for (var i = 0; i < neighbors.length; ++i)
        {
            if (bfs_edges.get(neighbors[i]).from == node_analized)
            {
                var destination = bfs_edges.get(neighbors[i]).to;
                if (!visited[destination - 1])
                {

                    // Organizo edges para que siga un orden ascendente de nodos
                    temp_queue.push(destination);
                    visited[destination - 1] = true;
                }
            }
        }
        // Con esto, el recorrido se hace en orden de nodos ascendente
        temp_queue.sort(function(a, b) {return a - b});
        for (var i = 0; i < temp_queue.length; ++i)
        {
            queue.push(temp_queue[i]);
        }
    }



		auto stop = chrono::high_resolution_clock::now(); // Aqui se guarda el tiempo en ese momento
		auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);

		printf("BFS tardó %lld microsegundos\n", duration.count());
}


void PrimUtil(int start_node, set<int> nodes, vector< pair<parN, int> > edges)
{
		int parent[node_number];
		int key[node_number];
		bool mstSet[node_number];

		// // Initialize all keys as INFINITE
		// for (int i = 0; i < node_number; i++)
		// 		key[i] = INT_MAX, mstSet[i] = false;
		//
		// // Always include first 1st vertex in MST.
		// // Make key 0 so that this vertex is picked as first vertex.
		// key[0] = 0;
		// parent[0] = -1; // First node is always root of MST
		// auto start = chrono::high_resolution_clock::now();
		// // The MST will have node_number vertices
		// for (int count = 0; count < node_number - 1; ++count)
		// {
		// 		// Pick the minimum key vertex from the
		// 		// set of vertices not yet included in MST
		// 		int u = minKey(key, mstSet);
		//
		// 		// Initialize min value
		//     int u = INT_MAX, min_index;
		//
		//     for (int v = 0; v < node_number; ++v)
		//         if (mstSet[v] == false && key[v] < min)
		//             u = key[v], min_index = v;
		//
		// 		// Add the picked vertex to the MST Set
		// 		mstSet[u] = true;
		//
		// 		// Update key value and parent index of
		// 		// the adjacent vertices of the picked vertex.
		// 		// Consider only those vertices which are not
		// 		// yet included in MST
		// printf("Me está faltando la ultima condición\n");
		// 		// for (int v = 0; v < node_number; ++v)
		// 		//
		// 		// 		// graph[u][v] is non zero only for adjacent vertices of m
		// 		// 		// mstSet[v] is false for vertices not yet included in MST
		// 		// 		// Update the key only if graph[u][v] is smaller than key[v]
		// 		// 		if (graph[u][v] && mstSet[v] == false && graph[u][v] < key[v])
		// 		// 				parent[v] = u, key[v] = graph[u][v];
		// }
		//
		// auto stop = chrono::high_resolution_clock::now(); // Aqui se guarda el tiempo en ese momento
		// auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);
		//
		// printf("Prim tardó %lld microsegundos\n", duration.count());

}


void KruskalUtil(set<int> nodes, vector< pair<parN, int> > edges)
{
    vector< pair<parN, int> > mst;

    sort(edges.begin(), edges.end(), asc_peso);

    // for (int i = 0; i < edges.size(); ++i)
    // {
    //     printf("De: %d, a: %d, con peso: %d\n", edges[i].first.first, edges[i].first.second, edges[i].second);
    // }

    int nodos[node_number];
    for (int i = 0; i < node_number; ++i)
    {
      nodos[i] = i+1;
    }

    DisjSet disj_set(node_number);

    int cont = 0, num_aristas = edge_number;

    auto start = chrono::high_resolution_clock::now();

    while ((num_aristas > 0) && (disj_set.size() > 1))
    {
        if (!disj_set.connected(edges[cont].first.first, edges[cont].first.second))
        {
            mst.push_back(edges[cont]);
            disj_set.Union(edges[cont].first.first, edges[cont].first.second);
            num_aristas--;

            printf("De: %d, a: %d, con peso: %d\n", edges[cont].first.first, edges[cont].first.second, edges[cont].second);
        }
        cont++;
    }

    auto stop = chrono::high_resolution_clock::now(); // Aqui se guarda el tiempo en ese momento
    auto duration = chrono::duration_cast<chrono::microseconds>(stop - start);

    printf("Kruskal tardó %lld microsegundos\n", duration.count());
}


int main(int argc, char const *argv[])
{
    vector< pair<parN, int> > edges;
    set<int> nodes;

    node_number = 14;
    edge_number = 18;

    for (int i = 0; i < node_number; ++i)
    {
        nodes.insert(i+1);
    }

    /* El orden es {{origen, destino}, peso} */
    /* Para obtener origen sería "edges[i].first.first" */
		/* Para obtener destino sería "edges[i].first.second" */
		/* Para obtener peso sería "edges[i].second" */
    edges.push_back({{3, 2}, 1});
    edges.push_back({{3, 7}, 2});
    edges.push_back({{2, 8}, 8});
    edges.push_back({{2, 1}, 6});
    edges.push_back({{7, 6}, 4});
    edges.push_back({{7, 8}, 3});
    edges.push_back({{7, 14}, 2});
    edges.push_back({{8, 10}, 6});
    edges.push_back({{8, 6}, 2});
    edges.push_back({{1, 4}, 7});
    edges.push_back({{1, 5}, 9});
    edges.push_back({{6, 9}, 9});
    edges.push_back({{14, 10}, 4});
    edges.push_back({{10, 12}, 7});
    edges.push_back({{10, 11}, 8});
    edges.push_back({{5, 11}, 9});
    edges.push_back({{9, 8}, 9});
    edges.push_back({{11, 13}, 2});


    KruskalUtil(nodes, edges);
		PrimUtil(3, nodes, edges);

    return 0;
}
