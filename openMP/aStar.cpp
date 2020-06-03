/*
------------------------- ALGORITMO A* -------------------------
    Paralelización en C++
-----------------------------------------------------------------
Para el algoritmo A* la paralelización resultó ser algo sencilla 
porque a simple vista viendo la suceción del algoritmo se puede
observar que es entreamente secuencial y para paraleliar este
algoritmo se utilizó open mp con 2 thread para que no ocurran 
secciones criticas y dejen el path con datos inestables. 
Para esta implementación se decidió realizar una implemtnación 
para encontrar el caminomás corto dentro de unna matriz para 
visualizar mejor el algoritmo.
-----------------------------------------------------------------
*/
#include <omp.h>
#include <bits/stdc++.h> 
#include <list>
#include <algorithm>
#include <iostream>
using namespace std; 

#define ROW 9 
#define COL 10 

#include <list>
#include <algorithm>
#include <iostream>
 
class point {
public:

	int x, y;
    /* Constructor de un punto para moverse entre la matriz
    * @param a: representa el eje x 
	* @param b: representa las y 
    */
   
    point( int a = 0, int b = 0 ) { x = a; y = b; }

	/* Verificar la posicion de un punto en la matriz
    * @param o: refrencia a un punto dado
    */
    bool operator ==( const point& p ) { return p.x == x && p.y == y; }

	/* Calculo auxiliar para calcular la heuristica
    * @param o: refrencia a un punto dado
    */
    point operator +( const point& p ) { return point( p.x + x, p.y + y ); }

};
 
class maps {
public:
    char m[8][8];
    int width, height;
	/* Constructor incializador de la matriz de desplazamiento
    */
    maps() {
        char t[8][8] = {
            {0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0},
            {0, 0, 0, 0, 1, 1, 1, 0}, {0, 0, 1, 0, 0, 0, 1, 0},
            {0, 0, 1, 0, 0, 0, 1, 0}, {0, 0, 1, 1, 1, 1, 1, 0},
            {0, 0, 0, 0, 0, 0, 0, 0}, {0, 0, 0, 0, 0, 0, 0, 0}
        };
        width = height = 8;
        for( int i = 0; i < height; i++ )
            for( int j = 0; j < width; j++ )
                m[i][j] = t[i][j];
    }
	/* Regresa un punto en la matriz
    */
    int operator() (int x, int y) { 
	return m[x][y];
	}

};
 
class node {
public:
	/* Operaciones lógicas entre nodos para ahorrar la extensión del código
	 * @return bool: Condición de verdad
    */
    bool operator == (const node& n ) { 
		return pos == n.pos; 
	}
    bool operator == (const point& n ) {
		return pos == n; 
	}
    bool operator < (const node& n ) {
		return dist + cost < n.dist + n.cost; 
	}
    point pos, parent;
    int dist, cost;
};
 
class aStar {
public:
    maps m; 
	point end, start;
    point neighbours[8];
    list<node> open;
    list<node> closed;
	
	/* Constructor inicializador de los vecinos dentro de la matriz
	*  tomando como referencia un punto
    */
    aStar() {
        neighbours[0] = point( -1, -1 ); neighbours[1] = point(  1, -1 );
        neighbours[2] = point( -1,  1 ); neighbours[3] = point(  1,  1 );
        neighbours[4] = point(  0, -1 ); neighbours[5] = point( -1,  0 );
        neighbours[6] = point(  0,  1 ); neighbours[7] = point(  1,  0 );
    }

 	/* Calculo de la predicción heurística
	 * @param p: punto de referencia
	 * @return int: Valor heuristica
    */
    int calc_dist(point& p){
        int x = end.x - p.x, y = end.y - p.y;
        return( x * x + y * y );
    }

  	/* Verifica si el punto es válido, es decir no es una pared
	 * @param p: punto de referencia
	 * @return bool: Es válido o no
    */
    bool is_valid(point& p) {
        return (p.x >-1 && p.y > -1 && p.x < m.width && p.y < m.height);
    }


   	/* Verifica si el punto es existe o si ya se ha analizado
	 * @param p: punto de referencia
	 * @param cost: costo que tiene acceder a ese punto desde el origen
	 * @return bool: Existe o no el punto
    */
    bool exist_point(point& p, int cost) {
        list<node>::iterator i;
        i = find(closed.begin(), closed.end(), p);
        if( i != closed.end() ) {
            if( (*i ).cost + ( *i ).dist < cost) return true;
            else { closed.erase( i ); return false; }
        }
        i = find(open.begin(), open.end(), p);
        if(i != open.end()) {
            if(( *i ).cost + ( *i ).dist < cost) return true;
            else { open.erase( i ); return false; }
        }
        return false;
    }


    /* Calculo del coste de los vecinos adyacentes al nodo seleccionado y
	 * checa que tan probable es tomar ese rumbo mediante la fórmula:
	 * f(n)=g(n)+h(n) donde n es igual al nodo a analizar
	 * @param n: Nodo a analizar
	 * @return bool: Encontró la meta deseada
    */
    bool check_neighbour(node &n) {
		int stepCost, nc, dist;
        point neighbour;
	 
        for( int x = 0; x < 8; x++ ) {
            stepCost = x < 4 ? 1 : 1;
			neighbour = n.pos + neighbours[x];
			if( neighbour == end ){
				return true;
			}
            if( is_valid( neighbour ) && m( neighbour.x, neighbour.y ) != 1 ) {
                nc = stepCost + n.cost;
                dist = calc_dist( neighbour );
                if( !exist_point( neighbour, nc + dist ) ) {
                    node m;
                    m.cost = nc; m.dist = dist;
                    m.pos = neighbour; 
                    m.parent = n.pos;
                    open.push_back( m );
                }
            }
        }	
        return false;
    }

     /* Asignación de el mejor camino y este método es el que dicta cuáles
	 * nodos ya he visitado y cuales me faltan por visitar hata que la
	 * estructura de open esté vacía
	 * @param s: Punto donde debe de empezar
	 * @param e: Punto donde debe de acabar
	 * @param mp: Matriz de desplazamiento
	 * @return bool: Verificar si si terminó el ciclo
    */
    bool search(point & s, point & e, maps & mp) {
        node n; end = e; start = s; m = mp;
        n.cost = 0; n.pos = s; n.parent = 0; n.dist = calc_dist( s ); 
        open.push_back( n );
		bool ret=false;

		/*En este punto se decidió realizar el paralelismo porque 
		* en este moemento de el algoritmo es cuendo se empieza a decidir cuál es el
		* mejor camino a escoger así que se empiezan a dividir los thread entre los nodos que
		* no se han analizado para optimizar la ejecución.
		* 
		* En dado caso de que se empiecen a utilizar más hilos ocurre un segmentation fault porque 
		* entre más nodos se analicen de manera simultánea, más se diversifica el camino, volviendo
		* ciertas variables como path inestables y de esa manera no se pueden acceder a ellas de manera
		* correcta.
		*/

		#pragma omp parallel num_threads(2)
        while(!open.empty()) {
            node n = open.front();
            open.pop_front();
            closed.push_back( n );

        	if(check_neighbour( n )){
				ret= true;
				break;
			}
			else ret= false;
        }
		return ret;
        
    }

 
     /* Reestructuración de el mejor camino acorde a las decisiones tomadas
	 * en los otros métodos para que su visalización sea la más acertada
	 * @param path: Estructura a reconstruir
	 * @return int: El costo que se tiene al recorrer el camino
    */
    int path(list<point>& path) {
        path.push_front( end );
        int cost = 1 + closed.back().cost; 
        path.push_front( closed.back().pos );
        point parent = closed.back().parent;
 
        for(list<node>::reverse_iterator i = closed.rbegin(); i != closed.rend(); i++) {
            if( ( *i ).pos == parent && !( ( *i ).pos == start ) ) {
                path.push_front( ( *i ).pos );
                parent = ( *i ).parent;
            }
        }
        path.push_front( start );
        return cost;
    }
 

};
 
int main( ) {
    maps matrix;
    point begin, final( 7, 7 );
    aStar a_star;	
    if( a_star.search( begin, final, matrix ) ) {

        std::list<point> path;
        int c = a_star.path( path );
        cout << "Path cost " << c << ": ";
        for( list<point>::iterator i = path.begin(); i != path.end(); i++ ) {
            cout<< "(" << ( *i ).x << ", " << ( *i ).y << ") ";
        }


    }
			cout<<"\n"<<endl;


    return 0;
}

