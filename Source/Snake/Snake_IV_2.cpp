#include<stdio.h>
#include<stdlib.h>
#include<conio.h>
#include<string.h>
#include<windows.h>
#include<iostream>

#define MAPX (28)
#define MAPY (28)
using namespace std;

char TEST = 0; 

enum SIGN{GROUND, HEAD, UP, DOWN, RIGHT, LEFT, STAR, STAR2,
	AI_WORKING, AUTHOR, SPEED_UP, SLOW_DOWN, OPEN_LIGHT,NORMAL, EAT,
	CRASH, NO_REACTION};

void gotoxy(int xpos, int ypos)
{
	COORD scrn;
	HANDLE hOuput = GetStdHandle(STD_OUTPUT_HANDLE);
	scrn.X = xpos; scrn.Y = ypos;
	SetConsoleCursorPosition(hOuput,scrn);
}


void pause(void)
{
	if(getch() == 224)
	{
		getch();
	}
}
class object
{
	int a, b;
	
	char (*map)[MAPY];
	
	char (*Blocks)[3];
	int *Colors, *Light_Colors;
	int starx, stary;
	int open_light;
	
	public:
		object()
		{
			map = (char (*)[MAPY])malloc( sizeof( char[MAPY] ) * MAPX);
			for(a = 0; a < MAPX; a++)
			{
				for(b = 0; b < MAPY; b++)
				{
					map[a][b] = GROUND;
				}
			}
			map[MAPX-1][0] = RIGHT;
			map[MAPX-1][1] = RIGHT;
			map[MAPX-1][2] = HEAD;
			Blocks = (char (*)[3])malloc( sizeof( char [3] ) * 8);
			Colors = (int *)malloc( sizeof(int) * 8);
			Light_Colors = (int *)malloc( sizeof(int) * 8);
			strcpy(Blocks[0], "　");	Colors[0] = 7;	Light_Colors[0] = 8;
			strcpy(Blocks[1], "■");	Colors[1] = 10;	Light_Colors[1] = 160;
			strcpy(Blocks[2], "■");	Colors[2] = 2;	Light_Colors[2] = 32;
			strcpy(Blocks[3], "■");	Colors[3] = 2;	Light_Colors[3] = 32;
			strcpy(Blocks[4], "■");	Colors[4] = 2;	Light_Colors[4] = 32;
			strcpy(Blocks[5], "■");	Colors[5] = 2;	Light_Colors[5] = 32;
			strcpy(Blocks[6], "★");	Colors[6] = 14;	Light_Colors[6] = 224;
			strcpy(Blocks[7], "☆");	Colors[7] = 14;	Light_Colors[7] = 224;
			open_light = 0;
		}
		
		int monitor(int x, int y, char water[][MAPY], char mode)
		{
			if(mode == 1)
			{
				FindPath(water, map, starx, stary, -1, -1);
			}
			if(open_light == 0)
			{
				gotoxy(2 * y + 2, x + 1);
				
				SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),
					Colors[ map[x][y] ] );
				
				cout<< Blocks[ map[x][y] ];
				
				SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),
					7 );
			}
			else
			{
				for(a = 0; a < MAPX; a++)
				{
					gotoxy(2, a + 1);
					for(b = 0; b < MAPY; b++)
					{
						SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),
							Light_Colors[ map[a][b] ] );
						printf("%2d", water[a][b]);
					}
				}
			}
			
			return 0;
		}
		int fix(int x, int y, int value, char water[][MAPY], char mode)
		{
			int temp;
			if( x >= 0 && x < MAPX && y >= 0 && y < MAPY )
			{
				temp = map[x][y];
				map[x][y] = value;
				monitor(x, y, water, mode);
			}
			else
			{
				temp = -1;
			}
			return temp;
		}
		void setstar(char water[][MAPY], char mode, FILE *fptr)
		{
			do
			{
				starx = rand()%MAPX;
				stary = rand()%MAPY;
			}while(map[starx][stary] != GROUND);
			
			if(TEST == 1)
			{ 
				fprintf(fptr,"%d %d\n",starx,stary); 
			} 
			
			fix(starx, stary, STAR, water, mode);
			return ;
		}
		
		friend class Snake;
		friend void welcome(const class object);
		friend int main(void);
		friend char Input(char mode, char water[][MAPY], class object MAP, class Snake snake);
		friend void FindPath(char water[][MAPY], char map[][MAPY], int x, int y, int X, int Y);
		friend char AI(char water[][MAPY], class object MAP, class Snake snake);
};
class Snake
{
	int headx, heady;
	int tailx, taily;
	int dirx, diry;
	char trace[4], count;
	unsigned int length, score;
	public:
		Snake()
		{
			headx = MAPX - 1;
			heady = 2;
			tailx = MAPX - 1;
			taily = 0;
			dirx = 0;
			diry = 1;
			for(count = 0;count < 4; count++)
			{
				trace[count] = -1;
			}
			count = 0;
			length = 3;
			score = 0; 
			/**
			gotoxy(2*(heady)+2,headx+1);
			cout<<"..";
			pause();/**/
		}
		void fixdir(char inputdir)
		{
			if(inputdir == -1)
			{
				cout<<"There is something that out of consideration.";
				getch();
			}
			else
			{
				if(inputdir == UP)
				{
					if(dirx == 0)
					{
						dirx = -1;
						diry = 0;
					}
				}
				else if(inputdir == LEFT)
				{
					if(diry == 0)
					{
						dirx = 0;
						diry = -1;
					}
				}
				else if(inputdir == RIGHT)
				{
					if(diry == 0)
					{
						dirx = 0;
						diry = 1;
					}
				}
				else if(inputdir == DOWN)
				{
					if(dirx == 0)
					{
						dirx = 1;
						diry = 0;
					}
				}
			}
			return ;
		}
		char move(class object MAP, char water[][MAPY], char mode)
		{
			int sit;
			int temp;
			if(dirx == -1)
			{
				temp = UP;
			}
			else if(diry == -1)
			{
				temp = LEFT;
			}
			else if(diry == 1)
			{
				temp = RIGHT;
			}
			else if(dirx == 1)
			{
				temp = DOWN;
			}
			trace[count] = temp;
			count = (count + 1) % 4;
			MAP.fix(headx, heady, temp, water, mode);
			headx += dirx;
			heady += diry;
			sit = MAP.fix(headx, heady, HEAD, water, mode);
			if(sit == -1 || (sit != STAR && sit != STAR2 && sit != GROUND))
			{
				sit = CRASH;
				gotoxy(2 * heady + 2, headx + 1);
				SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), MAP.Colors[HEAD]);
				cout<<MAP.Blocks[HEAD];
				SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), 7);
				
			}
			else if(sit != STAR && sit!= STAR2)
			{
				sit = NORMAL;
				temp = MAP.map[tailx][taily];
				MAP.fix(tailx, taily, GROUND, water, mode);
				if(temp == UP)
				{
					tailx--;
				}
				else if(temp == LEFT)
				{
					taily--;
				}
				else if(temp == RIGHT)
				{
					taily++;
				}
				else if(temp == DOWN)
				{
					tailx++;
				}
			}
			else
			{
				sit = EAT;
			}
			return sit;
		}
		
		
		friend int main(void);
		friend char Input(char mode, char water[][MAPY], class object MAP, class Snake snake);
		friend char AI(char water[][MAPY], class object MAP, class Snake snake);
};
void welcome(const class object MAP)
{
	int a,b;
	gotoxy(0,0);
	for(a = 0; a < MAPX + 12; a++)
	{
		cout<<"□";
	}
	for(a = 0; a < MAPX; a++)
	{
		cout<<"□";
		for(b = 0; b < MAPY; b++)
		{
			SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),
				MAP.Colors[ MAP.map[a][b] ] );
			
			cout<< MAP.Blocks[ MAP.map[a][b] ];
			
			SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),
				MAP.Colors[ MAP.map[a][b] ] );
		}
		cout<<"□　　　　　　　　　□";
	}
	for(a = 0; a < MAPX + 12; a++)
	{
		cout<<"□";
	}
	gotoxy(2 * MAPY + 4, 2);
	cout<<"　貪吃蛇";
  	gotoxy(2 * MAPY + 4, 3);
  	cout<<"　　 Snake_IV_2";
  	gotoxy(2 * MAPY + 4, 5);
  	cout<<"　　   By pi314 ";
  	gotoxy(2 * MAPY + 4, 7);
  	cout<<"□□□□□□□□□";
  	gotoxy(2 * MAPY + 4, 9);
  	cout<<"　　遊戲現況";
  	gotoxy(2 * MAPY + 4, 11);
  	cout<<"　長度:   3";
  	gotoxy(2 * MAPY + 4, 12);
  	cout<<"　速度: 1/20";
  	gotoxy(2*MAPY+4,13);
  	cout<<"　分數:   0";
  	gotoxy(2*MAPY+4,15);
  	cout<<"□□□□□□□□□";
  	gotoxy(2*MAPY+4,17);
  	cout<<"　　遊戲操作";
  	gotoxy(2*MAPY+4,19);
  	cout<<"　↑↓←→";
  	gotoxy(2*MAPY+4,20);
  	cout<<"　　控制蛇的";
  	gotoxy(2*MAPY+4,21);
  	cout<<"　　　行進方向";
  	gotoxy(2*MAPY+4,23);
  	cout<<"　+ - 加速減速";
  	gotoxy(2*MAPY+4,25);
  	cout<<"　□□　　　□□";
  	gotoxy(2*MAPY+4,26);
  	cout<<"□□ 普通模式 □□";
  	gotoxy(2*MAPY+4,27);
  	cout<<"　□□　　　□□";
	gotoxy(20,13);
	cout<<"請按任意鍵開始遊戲";
	a = getch(); 
	if(a == 27)
	{
		TEST = 1; 
	}
	else if(a == -32 || a == 0) 
	{
		getch(); 
	} 
	return ;
}
char Input(char mode, char water[][MAPY], class object MAP, class Snake snake)
{
	char ch[2] = {-1, -1};
	int a, b;
	
	if(kbhit())
	{
		ch[0] = getch();
		if(ch[0] == -32 || ch[0] == 0)
		{
			ch[1] = getch();
		}
	}
	if(ch[0] == 27)
	{
		return AI_WORKING;
	}
	else if(ch[0] == '`')
	{
		return AUTHOR;
	}
	else if(ch[0] == '+' || (ch[0] == -32 && ch[1] == 73))
	{
		return SPEED_UP;
	}
	else if(ch[0] == '-' || (ch[0] == -32 && ch[1] == 81))
	{
		return SLOW_DOWN;
	}
	else if(ch[0] == '\\' || (ch[0] == 0 && ch[1] == 59))
	{
		return OPEN_LIGHT;
	}
	if(mode == 0)
	{
		if(ch[1] == 72 || ch[0] == 'w' || ch[0] == 'W')
		{
			return UP;
		}
		else if(ch[1] == 75 || ch[0] == 'a' || ch[0] == 'A')
		{
			return LEFT;
		}
		else if(ch[1] == 77 || ch[0] == 'd' || ch[0] == 'D')
		{
			return RIGHT;
		}
		else if(ch[1] == 80 || ch[0] == 's' || ch[0] == 'S')
		{
			return DOWN;
		}
		else
		{
			return NO_REACTION;
		}
	}
	else if(mode == 1)
	{
		return AI(water, MAP, snake);
	}
	cout<<"Input -1";
	return -1;
}
char AI(char water[][MAPY], class object MAP, class Snake snake)
{
	int a, b;
	int max;
	int count[4] = {0};
	char Count_Blocks[MAPX][MAPY];
	static char change = 0;
	FindPath(water, MAP.map, MAP.starx, MAP.stary, -1, -1);
	
	if(snake.headx + snake.dirx <0 || snake.headx + snake.dirx >= MAPX || 
		snake.heady + snake.diry < 0 || snake.heady + snake.diry >= MAPY ||
		water[snake.headx + snake.dirx][snake.heady + snake.diry] == -1 ||/*撞到東西*/
		change >= 4)/*迴轉太多次*/
	{
		for(a = 0; a < 4; a++)
		{
			count[a] = 0;
		}
		max = 0;
		if(snake.headx - 1 >= 0)
		{// && MAP.map[snake.headx - 1][snake.heady] == GROUND
			FindPath(Count_Blocks, MAP.map, snake.headx - 1, snake.heady, snake.headx, snake.heady);
			for(a = 0; a < MAPX; a++)
			{
				for(b = 0; b < MAPY; b++)
				{
					if(Count_Blocks[a][b] > 0)
					{
						count[0]++;
					}
				}
			}
			max = 0;
		}
		if(snake.heady - 1 >= 0)
		{
			FindPath(Count_Blocks, MAP.map, snake.headx, snake.heady - 1, snake.headx, snake.heady);
			for(a = 0; a < MAPX; a++)
			{
				for(b = 0; b < MAPY; b++)
				{
					if(Count_Blocks[a][b] > 0)
					{
						count[1]++;
					}
				}
			}
			if(count[1] == count[max])
			{
				if(water[snake.headx][snake.heady - 1] < water[snake.headx][snake.heady])
				{
					max = 1;
				}
			}
			else if(count[1] > count[max])
			{
				max = 1;
			}
		}
		if(snake.heady + 1 < MAPY)
		{
			FindPath(Count_Blocks, MAP.map, snake.headx, snake.heady + 1, snake.headx, snake.heady);
			for(a = 0; a < MAPX; a++)
			{
				for(b = 0; b < MAPY; b++)
				{
					if(Count_Blocks[a][b] > 0)
					{
						count[2]++;
					}
				}
			}
			if(count[2] == count[max])
			{
				if(water[snake.headx][snake.heady + 1] < water[snake.headx][snake.heady])
				{
					max = 2;
				}
			}
			else if(count[2] > count[max])
			{
				max = 2;
			}
		}
		if(snake.headx + 1 < MAPX)
		{
			FindPath(Count_Blocks, MAP.map, snake.headx + 1, snake.heady, snake.headx, snake.heady);
			for(a = 0; a < MAPX; a++)
			{
				for(b = 0; b < MAPY; b++)
				{
					if(Count_Blocks[a][b] > 0)
					{
						count[3]++;
					}
				}
			}
			if(count[3] == count[max])
			{
				if(water[snake.headx + 1][snake.heady] < water[snake.headx][snake.heady])
				{
					max = 3;
				}
			}
			else if(count[3] > count[max])
			{
				max = 3;
			}
		}
		if(max == 0)
		{
			return UP;
		}
		else if(max == 1)
		{
			return LEFT;
		}
		else if(max == 2)
		{
			return RIGHT;
		}
		else if(max == 3)
		{
			return DOWN;
		}
	}
	else
	{
		if(water[snake.headx][snake.heady] != 0)/*有路可吃到星星*/
		{
			change = 0;
			if(water[snake.headx + snake.dirx][snake.heady + snake.diry] < 
				water[snake.headx][snake.heady])
			{
				return NO_REACTION;
			}
			else
			{
				if(snake.headx - 1 >= 0)
				{
					if(water[snake.headx - 1][snake.heady] < water[snake.headx][snake.heady] && 
						water[snake.headx - 1][snake.heady] > 0)
					{
						return UP;
					}
				}
				if(snake.heady - 1 >= 0)
				{
					if(water[snake.headx][snake.heady - 1] < water[snake.headx][snake.heady] && 
						water[snake.headx][snake.heady - 1] > 0)
					{
						return LEFT;
					}
				}
				if(snake.heady + 1 < MAPY)
				{
					if(water[snake.headx][snake.heady + 1] < water[snake.headx][snake.heady] && 
						water[snake.headx][snake.heady + 1] > 0)
					{
						return RIGHT;
					}
				}
				if(snake.headx + 1 < MAPX)
				{
					if(water[snake.headx + 1][snake.heady] < water[snake.headx][snake.heady] && 
						water[snake.headx + 1][snake.heady] > 0)
					{
						return DOWN;
					}
				}
				cout<<"turn -1.";
				return -1;
			}
		}
		else
		{
			if(snake.dirx != 0)
			{
				if( (
						(
							snake.trace[(snake.count + 1) % 4] == LEFT && 
							snake.trace[(snake.count + 2) % 4] == LEFT
						)
						|| 
						(
							snake.trace[(snake.count + 1) % 4] == RIGHT && 
							snake.trace[(snake.count + 2) % 4] == RIGHT
						) 
					)
					&&
					change < 4
				)
				{
					change++;
					if(snake.heady - 1 >= 0 && MAP.map[snake.headx][snake.heady - 1] == GROUND)
					{
						return LEFT;
					}
					else if(snake.heady + 1 < MAPY && MAP.map[snake.headx][snake.heady + 1] == GROUND)
					{
						return RIGHT;
					}
					else
					{
						return NO_REACTION;
					}
				}
				else
				{
					if(change >= 4)
					{
						change = 0;
					}
					return NO_REACTION;
				}
				
			}
			else if(snake.diry != 0)
			{
				if( (
						(
							snake.trace[(snake.count + 1) % 4] == UP && 
							snake.trace[(snake.count + 2) % 4] == UP
						)
						|| 
						(
							snake.trace[(snake.count + 1) % 4] == DOWN && 
							snake.trace[(snake.count + 2) % 4] == DOWN
						)
					)
					&&
					change < 4
				)
				{
					change++;
					if(snake.headx - 1 >= 0 && MAP.map[snake.headx - 1][snake.heady] == GROUND)
					{
						return UP;
					}
					else if(snake.headx + 1 < MAPX && MAP.map[snake.headx + 1][snake.heady] == GROUND)
					{
						return DOWN;
					}
					else
					{
						return NO_REACTION;
					}
				}
				else
				{
					if(change >= 4)
					{
						change = 0;
					}
					return NO_REACTION;
				}
				
			}
		}
	} 
	
	cout<<"AI -1.";
	return -1;
}
void FindPath(char water[][MAPY], char map[][MAPY], int x, int y, int X, int Y)
{
	int a, b;
	int stx[2][MAPX * MAPY], sty[2][MAPX * MAPY], top, top2, distance;
	for(a = 0; a < MAPX; a++)
	{
		for(b = 0; b < MAPY; b++)
		{
			if(map[a][b] == GROUND || map[a][b] == STAR || map[a][b] == STAR2 || 
				map[a][b] == HEAD)
			{
				water[a][b] = 0;
			}
			else
			{
				water[a][b] = -1;
			}
		}
	}
	if(X != -1 && Y != -1)
	{
		water[X][Y] = -1;
	}
	top = 1;
	stx[1][0] = x;
	sty[1][0] = y;
	if(water[x][y] == -1)
		return ;
	water[x][y] = 1;
	distance = 2;
	top2 = 0;
	while(top)
	{
		for(a = 0; a < top; a++)
		{
			if(stx[(distance + 1) % 2][a] - 1 >= 0)
			{
				if( water[stx[(distance + 1) % 2][a] - 1][sty[(distance + 1) % 2][a]] == 0)
				{
					water[stx[(distance + 1) % 2][a] - 1][sty[(distance + 1) % 2][a]] = distance;
					stx[distance % 2][top2] = stx[(distance + 1) % 2][a] - 1;
					sty[distance % 2][top2] = sty[(distance + 1) % 2][a];
					top2++;
				}
			}
			if(sty[(distance + 1) % 2][a] - 1 >= 0)
			{
				if( water[stx[(distance + 1) % 2][a]][sty[(distance + 1) % 2][a] - 1] == 0)
				{
					water[stx[(distance + 1) % 2][a]][sty[(distance + 1) % 2][a] - 1] = distance;
					stx[distance % 2][top2] = stx[(distance + 1) % 2][a];
					sty[distance % 2][top2] = sty[(distance + 1) % 2][a] - 1;
					top2++;
				}
			}
			if(sty[(distance + 1) % 2][a] + 1 < MAPY)
			{
				if( water[stx[(distance + 1) % 2][a]][sty[(distance + 1) % 2][a] + 1] == 0)
				{
					water[stx[(distance + 1) % 2][a]][sty[(distance + 1) % 2][a] + 1] = distance;
					stx[distance % 2][top2] = stx[(distance + 1) % 2][a];
					sty[distance % 2][top2] = sty[(distance + 1) % 2][a] + 1;
					top2++;
				}
			}
			if(stx[(distance + 1) % 2][a] + 1 < MAPX)
			{
				if( water[stx[(distance + 1) % 2][a] + 1][sty[(distance + 1) % 2][a]] == 0)
				{
					water[stx[(distance + 1) % 2][a] + 1][sty[(distance + 1) % 2][a]] = distance;
					stx[distance % 2][top2] = stx[(distance + 1) % 2][a] + 1;
					sty[distance % 2][top2] = sty[(distance + 1) % 2][a];
					top2++;
				}
			}
		}
		top = top2;
		top2 = 0;
		distance++;
	}
	return ;
}

int main(void)
{
	srand(time(NULL));
	FILE *fptr;
	class object MAP;
	class Snake snake;
	char mode;
	char sit;
	char water[MAPX][MAPY] = {0};
	int speed_list[] = {250,167,125,100,83,71,63,56,50,45,42,38,36,33,31,29,28,26,25,20,10};
	int bling_counter;
	int a, b;
	int author_display;
	int speed,lowest_speed;
	
	
	
	welcome(MAP);
	
	if(TEST) 
	{ 
		fptr=fopen("star.txt","a"); 
		fprintf(fptr,"========\n");
	} 
	
	MAP.setstar(water, mode, fptr);
	
	mode = 0;
	bling_counter = 0;
	author_display = 0;
	speed = 0;
	lowest_speed = 0;
	while(1)
	{
		Sleep( speed_list[speed] );
		bling_counter += speed_list[speed];
		if(bling_counter>=300)
		{
			bling_counter = 0;
			if(MAP.map[MAP.starx][MAP.stary] == STAR)
			{
				MAP.fix(MAP.starx, MAP.stary, STAR2, water, mode);
			}
			else if(MAP.map[MAP.starx][MAP.stary] == STAR2)
			{
				MAP.fix(MAP.starx, MAP.stary, STAR, water, mode);
			}
		}
		if(kbhit() || mode)
		{
			sit = Input(mode, water, MAP, snake);
			if(sit == AI_WORKING)
			{
				mode = (mode + 1) % 2;
				gotoxy(2 * MAPY + 8, 26);
				cout<<"─────";
				Sleep(50);
				gotoxy(2 * MAPY + 8, 26);
				if(mode == 1)
				{
					cout<<" 自動尋徑 ";
				}
				else
				{
					cout<<" 普通模式 ";
				}
			}
			else if(sit == AUTHOR)
			{
				author_display = (author_display + 1) % 2;
				gotoxy(2 * MAPY + 4, 5);
				cout<<"　　   ──── ";
				Sleep(50);
				gotoxy(2 * MAPY + 4, 5);
				if(author_display == 0)
				{
					cout<<"　　   By pi314 ";
				}
				else
				{
					cout<<"　　   By 池昌言";
				}
			}
			else if(sit == OPEN_LIGHT)
			{
				MAP.open_light = (MAP.open_light + 1) % 2;
				if(MAP.open_light == 0)
				{
					for(a = 0; a < MAPX; a++)
					{
						for(b = 0; b < MAPY; b++)
						{
							MAP.monitor(a, b, water, mode);
						}
					}
				}
			}
			else if(sit == SPEED_UP)
			{
				speed = speed < 19 ? speed + 1 : speed;
				gotoxy(2 * MAPY + 11, 12);
				cout<<"─";
				Sleep(30);
				printf("\b\b%2d", speed + 1);
				if(mode == 1)
				{
					sit = Input(mode, water, MAP, snake);
				}
			}
			else if(sit == SLOW_DOWN)
			{
				speed = speed > lowest_speed ? speed - 1 : speed;
				gotoxy(2 * MAPY + 11, 12);
				cout<<"─";
				Sleep(30);
				printf("\b\b%2d", speed + 1);
				if(mode == 1)
				{
					sit = Input(mode, water, MAP, snake);
				}
			}
			/**
			else if(sit == SPEED_UP || sit == SLOW_DOWN)
			{
				continue;
			}/**/
			snake.fixdir(sit);
		}
		sit = snake.move(MAP, water, mode);
		FindPath(water, MAP.map, MAP.starx, MAP.stary, -1, -1);
		if(sit == CRASH)
		{
			break;
		}
		else if(sit == EAT)
		{
			snake.length++;
			gotoxy(2 * MAPY + 12, 11);
			cout.width(3);
			cout<<snake.length;
			
			snake.score += (speed + 1) * 2 + (snake.length)/2;
  			gotoxy(2 * MAPY + 12, 13);
			cout.width(3);
  			cout<<snake.score;
  			if((snake.length - 3) % 7 == 0 && snake.length > 3)
  			{
				if(lowest_speed < 20)
				{ 
					lowest_speed++;
					if(speed < lowest_speed) 
					{
						speed = lowest_speed;
						gotoxy(2 * MAPY + 11, 12);
						cout<<"─";
						Sleep(30);
						printf("\b\b%2d", speed + 1);
					}
					if(lowest_speed == 20)
					{
						MAP.Colors[6] = MAP.Colors[7] = 12;
					}
				} 
			}
  			
			MAP.setstar(water, mode, fptr);
		}
	}
	if(TEST) 
	{ 
		fclose(fptr) ; 
	} 
	gotoxy(15,13);
	cout<<"遊戲結束，請按空白鍵結束遊戲。";
	do
	{
		a = getch();
		if(a == 224 || a == 0)
		{
			b = getch();
		}
		if(a == '`')
		{
			author_display = (author_display + 1) % 2;
			gotoxy(2 * MAPY + 4, 5);
			cout<<"　　   ──── ";
			Sleep(50);
			gotoxy(2 * MAPY + 4, 5);
			if(author_display == 0)
			{
				cout<<"　　   By pi314 ";
			}
			else
			{
				cout<<"　　   By 池昌言";
			}
		}
		else if(a == 27)
		{
			mode = (mode + 1) % 2;
			gotoxy(2 * MAPY + 8, 26);
			cout<<"─────";
			Sleep(50);
			gotoxy(2 * MAPY + 8, 26);
			if(mode == 1)
			{
				cout<<" 自動尋徑 ";
			}
			else
			{
				cout<<" 普通模式 ";
			}
		}
		else if(a == '+' || (a == 224 && b == 73))
		{
			speed = speed < 19 ? speed + 1 : speed;
			gotoxy(2 * MAPY + 11, 12);
			cout<<"─";
			Sleep(50);
			printf("\b\b%2d", speed + 1);
		}
		else if(a == '-' || (a == 224 && b == 81))
		{
			speed = speed > lowest_speed ? speed - 1 : speed;
			gotoxy(2 * MAPY + 11, 12);
			cout<<"─";
			Sleep(50);
			printf("\b\b%2d", speed + 1);
		}
	}while(a != ' ');
	gotoxy(0, 30);
	cout<<endl;
	cout<<"┌──11/21 ──────────┐\n";
	cout<<"│ Snake_III_0.exe  貪吃蛇 3.0  │\n";
	cout<<"└┬──────────────┴──────────┐\n";
	cout<<"  │http://www.cs.nctu.edu.tw/~cychih/Snake_III_0.exe │\n";
	cout<<"  └─────────────────────────┘\n\n";
	cout<<"特別感謝: ──────────────────────┐\n";
	cout<<"│2010/11/22 ex860抓出按下行進反方向會直接死亡的bug.  │\n";
	cout<<"│→ 修改為Snake_III_1.exe                           │\n";
	cout<<"└──────────────────────────┘\n\n";
	cout<<"特別感謝：───────────────────┐\n";
	cout<<"│在配色上採用CMturtle在2008年的作品\"追閃蛇\".   │\n";
	cout<<"├ - - - - - - - - - - - - - - - - - - - - - - -┤\n";
	cout<<"│11/26加強預防進入死巷的判斷能力。             │\n";
	cout<<"│11/29微幅加強走出死巷的能力。                 │\n";
	cout<<"│11/30加上計分系統。                           │\n";
	cout<<"│→ 修改為Snake_III_2.exe                     │\n";
	cout<<"└───────────────────────┘\n";
	cout<<"┌──2011/01/15──────────────────┐\n";
	cout<<"│從01/14下午開始用class重寫，約半夜時玩家部分完成。│\n";
	cout<<"└─────────────────────────┘\n";
	cout<<"┌──2011/01/17───────────────┐\n";
	cout<<"│完成AI演算法的核心。加上切換模式時的小特效。│\n";
	cout<<"│→Snake_IV_1.exe                            │\n";
	cout<<"└──────────────────────┘\n";
	cout<<"┌──2011/01/19──────────┐\n";
	cout<<"│加上更多小特效(隱藏的第21段速度)。│\n";
	cout<<"│→Snake_IV_2.exe　　　　　　　　　│\n";
	cout<<"└┬────────────────┴───────┐\n";
	cout<<"　│http://www.cs.nctu.edu.tw/~cychih/Snake_IV_2.exe│\n"; 
	cout<<"　└────────────────────────┘\n"; 
	cout<<"\n\n\n";
	cout<<"請按任意鍵結束遊戲 >>\n\n";
	pause();
	return 0;
}
