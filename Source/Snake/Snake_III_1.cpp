/*sleep  time 要調整，不能直接是rest ---  暫時先這樣= = */
/*慣性移動行為  done */
/*不要人工放置飼料  因為猶豫會讓處理變的複雜*/

#include<stdio.h>
#include<stdlib.h>
#include<conio.h>
#include<windows.h>
#include<time.h>
#define xx 39
#define yy 39
int length;
void gotoxy(int xpos, int ypos);
void pause(void);
int waterfilling(int *FindPath,int from_x,int from_y,int to_x,int to_y,int *pmap);
void setdir(int headdir,int *pmapdir,int *pdirx,int *pdiry);
void move(int *pheadx,int *pheady,int *ptailx,int *ptaily,int dirx,int diry,int *pmap,int *pi_setfood);
void setfood(int *pfoodx,int *pfoody,int *pmap,int *pi_setfood,int *pfoodpx,int *pfoodpy);
/*先不開放輸入地圖大小*/
/*但還是用指標傳遞陣列*/
/*mode[] {0,1}={snake-control  food-rand   , snake AI and food-rand}*/
main()
{
  SetConsoleTitle("Mode : Normal");
  srand(time(NULL));
  printf("請按任意鍵開始...");
  pause();
  int FindPath[xx][yy],map[xx][yy];
  int a,b,snake=0,movepermit,check[5],chk2,test;
  int from_x,from_y;
  int to_x,to_y;
  int headx,heady,mode,foodx,foody,tailx,taily;
  int dirx,diry,rest,i_setfood,foodpx,foodpy;
  char ch[2];
  
  headx=xx-1;
  heady=2;
  tailx=xx-1;
  taily=0;
  gotoxy(0,0);
  for(a=0;a<xx;a++)
  {
	for(b=0;b<yy;b++)
    {
	  FindPath[a][b]=map[a][b]=0;
	  printf("。");
	}
	printf("\n");
  }
  FindPath[xx-1][0]=FindPath[xx-1][1]=-1;
  map[xx-1][0]=map[xx-1][1]=26;
  
  foodx=foody=foodpx=foodpy=-1;
  mode=0;
  dirx=0;diry=1;
  rest=250;
  i_setfood=1;
  movepermit=1;
  chk2=0;
  length=3;
  gotoxy(0,xx-1);
  printf("■■□\n");
  printf("Snake's length:%4d\n",length);
  printf("    Speed     :%4d",rest);
  while(1)
  {
	Sleep(rest);
    if(kbhit()!=0)
    {
	  ch[0]=getch();
	  if(ch[0]==-32||ch[0]==0)
	    ch[1]=getch();
	  if(ch[0]==27)/*Esc --mode changing*/
	  {
	    mode=(mode+1)%2;
	    if(mode==0)
	    {
		  SetConsoleTitle("Mode : Normal");
		}
	    else if(mode==1)
	    {
		  SetConsoleTitle("Mode : Auto");
		}
	  }
	  else if(ch[0]==-32)/*方向鍵*/
	  { 
  	    if(mode==0)
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
	  }
	  else if(ch[0]==43)/* + speed up*/
	  { 
		if(rest==20)
		  ;
		else if(rest<=50)
		  rest-=10;
		else if(rest<=500)
		  rest-=50;
		else
		  rest-=100;
		gotoxy(0,xx+1);
        printf("    Speed     :%4d",rest);
	  }
	  else if(ch[0]==45)/* - slow down*/
	  {
		if(rest==20)
		  rest+=10;
		else if(rest<50)
		  rest+=10;
		else if(rest<=500)
		  rest+=50;
		else
		  rest+=100;
		gotoxy(0,xx+1);
  		printf("    Speed     :%4d",rest);
	  }
	  else if(ch[0]==32)
	    movepermit=(movepermit+1)%2;
	  else if(ch[0]==0&&ch[1]==59)
	  {
		snake=(snake+1)%3;
		if(snake==0)
		{
		  gotoxy(0,0);
		  for(a=0;a<xx;a++)
		  {
		    for(b=0;b<yy;b++)
		    {
			  if(map[a][b]>20)
			    printf("■");
			  else
	 		    printf("。");
			}
		    printf("\n");
		  }
		  gotoxy(2*foody,foodx);
		  printf("＊");
		}
	  }
	}
	if(i_setfood==1)
	{
	  do
	  {
	    foodx=rand()%xx;
	    foody=rand()%yy;
	  }while(map[foodx][foody]!=0);
	}
	if(i_setfood==1)
	  setfood(&foodx,&foody,&map[0][0],&i_setfood,&foodpx,&foodpy);
	if(mode==1)
    {
	  for(a=0;a<xx;a++)
	    for(b=0;b<yy;b++)
	    {
		  if(a==headx&&b==heady)
		    FindPath[a][b]=0;
		  else if(map[a][b]!=0&&map[a][b]!=1)
		    FindPath[a][b]=-1;
		  else
  		    FindPath[a][b]=0;
		}
	  test=waterfilling(&FindPath[0][0],foodpx,foodpy,headx,heady,&map[0][0]);
	  if(test==1)
	    ;
	  else
	  {
		for(a=0;a<xx;a++)
	       for(b=0;b<yy;b++)
	       {
		     if(a==headx&&b==heady)
		       FindPath[a][b]=0;
		     else if(map[a][b]!=0&&map[a][b]!=1)
		       FindPath[a][b]=-1;
		     else
  		       FindPath[a][b]=0;
		   }
		test=waterfilling(&FindPath[0][0],0,0,headx,heady,&map[0][0]);
	    if(test==1)
	      ;
	    else
	    {
	      for(a=0;a<xx;a++)
	        for(b=0;b<yy;b++)
	        {
		      if(a==headx&&b==heady)
		        FindPath[a][b]=0;
		      else if(map[a][b]!=0&&map[a][b]!=1)
		        FindPath[a][b]=-1;
		      else
  		        FindPath[a][b]=0;
		    }
	      test=waterfilling(&FindPath[0][0],xx-1,0,headx,heady,&map[0][0]);
	      if(test==1)
	        ;
		  else
		  {
			for(a=0;a<xx;a++)
			  for(b=0;b<yy;b++)
			  {
				if(a==headx&&b==heady)
				  FindPath[a][b]=0;
				else if(map[a][b]!=0&&map[a][b]!=1)
				  FindPath[a][b]=-1;
				else
		  		  FindPath[a][b]=0;
			  }
			test=waterfilling(&FindPath[0][0],0,yy-1,headx,heady,&map[0][0]);
		    if(test==1)
		      ;
			else
			{
			  for(a=0;a<xx;a++)
			    for(b=0;b<yy;b++)
			    {
			      if(a==headx&&b==heady)
			        FindPath[a][b]=0;
			      else if(map[a][b]!=0&&map[a][b]!=1)
			        FindPath[a][b]=-1;
			      else
			        FindPath[a][b]=0;
			    }
			  test=waterfilling(&FindPath[0][0],xx-1,yy-1,headx,heady,&map[0][0]);
			  if(test==1)
			    ;
			  else
			  {
			    for(a=0;a<xx;a++)
			      for(b=0;b<yy;b++)
			      {
			        if(a==headx&&b==heady)
			          FindPath[a][b]=0;
			        else if(map[a][b]!=0&&map[a][b]!=1)
			          FindPath[a][b]=-1;
			        else
			          FindPath[a][b]=0;
			      }
			    test=waterfilling(&FindPath[0][0],xx/2,yy/2,headx,heady,&map[0][0]);
			    if(test==1)
			      ;
			    else
			    {
				  for(a=0;a<xx;a++)
			        for(b=0;b<yy;b++)
			        {
			          if(a==headx&&b==heady)
			            FindPath[a][b]=0;
			          else if(map[a][b]!=0&&map[a][b]!=1)
			            FindPath[a][b]=-1;
			          else
			            FindPath[a][b]=0;
			        }
			      waterfilling(&FindPath[0][0],headx,heady,-1,-1,&map[0][0]);
	              int tempx,tempy,max=0;
			      for(a=0;a<xx;a++)
			        for(b=0;b<yy;b++)
			          if(FindPath[a][b]>max)
			          {
						tempx=a;
						tempy=b;
						max=FindPath[a][b];
					  }
					  for(a=0;a<xx;a++)
			            for(b=0;b<yy;b++)
			            {
			        	  if(a==headx&&b==heady)
			                FindPath[a][b]=0;
			          	  else if(map[a][b]!=0&&map[a][b]!=1)
			                FindPath[a][b]=-1;
			          	  else
			                FindPath[a][b]=0;
			        	}
				  waterfilling(&FindPath[0][0],tempx,tempy,headx,heady,&map[0][0]);
				}
			  }
			}
		  }
		}
	  }
	  /*
	  gotoxy(0,xx);
	  printf("%d",test);/**/
	  chk2=0;
	  if(FindPath[headx-1][heady]<FindPath[headx][heady]&&FindPath[headx-1][heady]!=0&&FindPath[headx-1][heady]!=-1&&headx>0/*&&check[0]>0*/)
	  {
		ch[1]=72;
		if(dirx==-1&&diry==0&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  if(FindPath[headx+1][heady]<FindPath[headx][heady]&&FindPath[headx+1][heady]!=0&&FindPath[headx+1][heady]!=-1&&headx<xx-1&&chk2==0/*&&check[2]>0*/)
	  {
		ch[1]=80;
		if(dirx==1&&diry==0&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  if(FindPath[headx][heady+1]<FindPath[headx][heady]&&FindPath[headx][heady+1]!=0&&FindPath[headx][heady+1]!=-1&&heady<yy-1&&chk2==0/*&&check[3]>0*/)
	  {
		ch[1]=77;
		if(dirx==0&&diry==1&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  if(FindPath[headx][heady-1]<FindPath[headx][heady]&&FindPath[headx][heady-1]!=0&&FindPath[headx][heady-1]!=-1&&heady>0&&chk2==0/*&&check[1]>0*/)
	  {
		ch[1]=75;
		if(dirx==0&&diry==-1&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  
	  if(chk2==0&&movepermit)
 	    setdir(ch[1],&map[headx][heady],&dirx,&diry);
	}
	
	if(movepermit==1)
 	  move(&headx,&heady,&tailx,&taily,dirx,diry,&map[0][0],&i_setfood);
	
	if(snake==1)
	{
	 gotoxy(0,0);
	 for(a=0;a<xx;a++)
	 {
	   for(b=0;b<yy;b++)
	     printf("%2d",FindPath[a][b]);
	   printf("\n");
	 }
	}
	else if(snake==2)
	{
	 gotoxy(0,0);
	 for(a=0;a<xx;a++)
	 {
	   for(b=0;b<yy;b++)
	     printf("%2d",map[a][b]);
	   printf("\n");
	 }
	}
	/*||map[headx][heady]>20*/
	if(headx<0||headx>=xx||heady<0||heady>=yy||map[headx][heady]>20)
	  break;
  }/*game's main loop end*/
  gotoxy(0,xx+2);
  printf("請按任意鍵結束遊戲 >>\n\n");
  pause();
  printf("┌──11/21 ──────────┐\n");
  printf("│ Snake_III_0.exe  貪吃蛇 3.0  │\n");
  printf("└┬──────────────┴──────────┐\n");
  printf("  │http://www.cs.nctu.edu.tw/~cychih/Snake_III_0.exe │\n");
  printf("  └─────────────────────────┘\n\n");
  printf("特別感謝: ───────────────────┐\n");
  printf("│11/22 ex860抓出按下行進反方向會直接死亡的bug. │\n");
  printf("│--> 修改為Snake_III_1.exe                     │\n");
  printf("└───────────────────────┘\n");
  printf("\n\n\n");
  printf("請按任意鍵結束遊戲 >>\n\n");
  pause();
  return 0;
}

void gotoxy(int xpos, int ypos)
{
  COORD scrn;    

  HANDLE hOuput = GetStdHandle(STD_OUTPUT_HANDLE);

  scrn.X = xpos; scrn.Y = ypos;

  SetConsoleCursorPosition(hOuput,scrn);
}

void pause(void)
{
  if(getch()==224)
    getch();
}

int waterfilling(int *FindPath,int from_x,int from_y,int to_x,int to_y,int *pmap)
{
  if(*(pmap+from_x*yy+from_y)!=0&&*(pmap+from_x*yy+from_y)!=1)
    return 0;
  int a,b,tempx,tempy,stx[xx*yy],sty[xx*yy],st2x[xx*yy],st2y[xx*yy],top,top2,water;
  int touch;
  top2=0;
  water=2;
  *(FindPath+(from_x)*yy+(from_y))=1;
  stx[0]=from_x;
  sty[0]=from_y;
  top=1;
  touch=0;
  while(1)
  {
    for(top--;top>=0;top--)
    {
	  tempx=stx[top];
	  tempy=sty[top];
	  if(tempx>0)
	  {
	    if(*(FindPath+(tempx-1)*yy+(tempy))==0)
	    {
		  *(FindPath+(tempx-1)*yy+(tempy))=water;
		  st2x[top2]=tempx-1;
		  st2y[top2]=tempy;
		  if(tempx-1==to_x&&tempy==to_y)
		    touch=1;
		  top2++;
		}
	  }
	  if(tempx<xx-1)
	  {
	    if(*(FindPath+(tempx+1)*yy+(tempy))==0)
	    {
		  *(FindPath+(tempx+1)*yy+(tempy))=water;
		  st2x[top2]=tempx+1;
		  st2y[top2]=tempy;
		  if(tempx+1==to_x&&tempy==to_y)
		    touch=1;
		  top2++;
		}
	  }
	  if(tempy>0)
	  {
	    if(*(FindPath+(tempx)*yy+(tempy-1))==0)
	    {
		  *(FindPath+(tempx)*yy+(tempy-1))=water;
		  st2x[top2]=tempx;
		  st2y[top2]=tempy-1;
		  if(tempx==to_x&&tempy-1==to_y)
		    touch=1;
		  top2++;
		}
	  }
	  if(tempy<yy-1)
	  {
	    if(*(FindPath+(tempx)*yy+(tempy+1))==0)
	    {
		  *(FindPath+(tempx)*yy+(tempy+1))=water;
		  st2x[top2]=tempx;
		  st2y[top2]=tempy+1;
		  if(tempx==to_x&&tempy+1==to_y)
		    touch=1;
		  top2++;
		}
	  }
	}
	if(top2==0)
	  break;
	/*
	if(*(FindPath+to_x*yy+to_y)!=0)
	  break;*/
	water++;
	top=top2;
	for(a=0;a<top2;a++)
	{
	  stx[a]=st2x[a];
	  sty[a]=st2y[a];
	}
	top2=0;
  }
  /*
  if(touch==0)
	    SetConsoleTitle("touch=0");
	  else
	    SetConsoleTitle("touch=1");/**/
  return touch;
}

void setdir(int headdir,int *pmapdir,int *pdirx,int *pdiry)
{
    if(headdir==72)
    {
      if(*pdiry!=0)
      {
        *pdirx=-1;
        *pdiry=0;
        *pmapdir=24;
	  }
    }
    else if(headdir==75)
	{
	  if(*pdirx!=0)
	  {
	    *pdirx=0;
  	    *pdiry=-1;
  	    *pmapdir=27;
	  }
	}
	else if(headdir==77)
	{
	  if(*pdirx!=0)
	  {
	    *pdirx=0;
  	    *pdiry=1;
  	    *pmapdir=26;
	  }
	}
	else if(headdir==80)
	{
	  if(*pdiry!=0)
	  {
	    *pdirx=1;
  	    *pdiry=0;
  	    *pmapdir=25;
	  }
	}
}

void move(int *pheadx,int *pheady,int *ptailx,int *ptaily,int dirx,int diry,int *pmap,int *pi_setfood)
{ 
  int tempx,tempy;
  tempx=dirx;
  tempy=diry;
  
  if(dirx==-1)
   *(pmap+(*pheadx)*yy+(*pheady))=24;
  else if(dirx==1)
   *(pmap+(*pheadx)*yy+(*pheady))=25;
  else if(diry==1)
   *(pmap+(*pheadx)*yy+(*pheady))=26;
  else if(diry==-1)
   *(pmap+(*pheadx)*yy+(*pheady))=27;/**/
   gotoxy(2*(*pheady),(*pheadx));
   printf("■");
  *pheadx+=dirx;
  *pheady+=diry;
  
  gotoxy(2*(*pheady),(*pheadx));
  printf("□");
  if(*(pmap+(*pheadx)*yy+(*pheady))==1)
  {
    *pi_setfood=1;
    length++;
    gotoxy(0,xx);
    printf("Snake's Length:%4d",length);
  }
  else
  {
	dirx=diry=0;
	if(*(pmap+(*ptailx)*yy+(*ptaily))==24)
	  dirx=-1;
	else if(*(pmap+(*ptailx)*yy+(*ptaily))==25)
	  dirx=1;
	else if(*(pmap+(*ptailx)*yy+(*ptaily))==26)
	  diry=1;
	else if(*(pmap+(*ptailx)*yy+(*ptaily))==27)
	  diry=-1;
	*(pmap+(*ptailx)*yy+(*ptaily))=0;
	gotoxy(2*(*ptaily),(*ptailx));
	printf("。");
	*ptailx+=dirx;
	*ptaily+=diry;
  }
  /*
  dirx=tempx;
  diry=tempy;
  
  if(dirx==-1)
   *(pmap+(*pheadx)*yy+(*pheady))=24;
  else if(dirx==1)
   *(pmap+(*pheadx)*yy+(*pheady))=25;
  else if(diry==1)
   *(pmap+(*pheadx)*yy+(*pheady))=26;
  else if(diry==-1)
   *(pmap+(*pheadx)*yy+(*pheady))=27;/**/
}
void setfood(int *pfoodx,int *pfoody,int *pmap,int *pi_setfood,int *pfoodpx,int *pfoodpy)
{
  *pi_setfood=0;
  *(pmap+(*pfoodx)*yy+(*pfoody))=1;
  gotoxy(2*(*pfoody),(*pfoodx));
  printf("＊");
  *pfoodpx=*pfoodx;
  *pfoodpy=*pfoody;
}
