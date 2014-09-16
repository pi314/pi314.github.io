/*sleep  time 要調整，不能直接是speed ---  暫時先這樣= = */
/*慣性移動行為  done */
/*不要人工放置飼料  因為猶豫會讓處理變的複雜*/

#include<stdio.h>
#include<stdlib.h>
#include<conio.h>
#include<windows.h>
#include<time.h>
#include<math.h>
#define xx 28
#define yy 28
int length,low_speed_limit,testing=0,point;
void gotoxy(int xpos, int ypos);
void pause(void);
int waterfilling(int *FindPath,int from_x,int from_y,int to_x,int to_y,int *pmap);
void setdir(int headdir,int *pmapdir,int *pdirx,int *pdiry);
void move(int *pheadx,int *pheady,int *ptailx,int *ptaily,int dirx,int diry,int *pmap,int *pi_setfood);
void setfood(int *pfoodx,int *pfoody,int *pmap,int *pi_setfood,int *pfoodpx,int *pfoodpy);
/*先不開放輸入地圖大小*/
/*但還是用指標傳遞陣列*/
/*mode[] {0,1}={snake-control  food-rand   , snake AI and food-rand}*/
/* SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),a); */
/*a=2  深綠     a=10 亮綠     a=14 亮黃     a=7 正常*/
main()
{
  SetConsoleTitle("Mode : Normal");
  srand(time(NULL));
  int FindPath[xx][yy],map[xx][yy],re[5],t,tt,authordisplay;
  int a,b,snake=0,movepermit,check[5],chk2,test,helpx,helpy,bling,blingcount;
  int from_x,from_y;
  int to_x,to_y;
  int headx,heady,mode,foodx,foody,tailx,taily,roomjudge;
  int dirx,diry,speed,i_setfood,foodpx,foodpy;
  char ch[2];
  int speedlist[]={250,167,125,100,83,71,63,56,50,45,42,38,36,33,31,29,28,26,25,10};
  
  
  headx=xx-1;  heady=2;  tailx=xx-1;  taily=0;
  gotoxy(0,0);
  for(a=0;a<xx+2+10;a++)
    printf("□");
  //printf("\n");
  for(a=0;a<xx;a++)
  {
	printf("□");
	for(b=0;b<yy;b++)
    {
	  FindPath[a][b]=map[a][b]=0;
	  printf("　");
	}
	printf("□　　　　　　　　　□");
  }
  for(a=0;a<xx+2+10;a++)
    printf("□");
  FindPath[xx-1][0]=FindPath[xx-1][1]=-1;  map[xx-1][0]=map[xx-1][1]=26;
  
  foodx=foody=foodpx=foodpy=-1;  mode=0;  dirx=0;diry=1;  speed=0;  i_setfood=1;
  movepermit=1;  chk2=0;  length=3;  bling=0;  blingcount=0;  roomjudge=3;
  t=0;  tt=0;  authordisplay=0;  low_speed_limit=0;  point=0;
  gotoxy(0+2,xx-1+1);
  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),2);
  printf("■■");
  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),10);
  printf("■");
  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
  gotoxy(2*yy+4,2);
  printf("　貪吃蛇");
  gotoxy(2*yy+4,3);
  printf("　　 Snake_III_2");
  gotoxy(2*yy+4,5);
  printf("　　   By pi314 ");
  gotoxy(2*yy+4,7);
  printf("□□□□□□□□□");
  gotoxy(2*yy+4,9);
  printf("　　遊戲現況");
  gotoxy(2*yy+4,11);
  printf("　長度:%4d",length);
  gotoxy(2*yy+4,12);
  printf("　速度:%2d/19",speed+1);
  gotoxy(2*yy+4,13);
  printf("　分數:%4d",point);
  gotoxy(2*yy+4,15);
  printf("□□□□□□□□□");
  gotoxy(2*yy+4,17);
  printf("　　遊戲操作");
  gotoxy(2*yy+4,19);
  printf("　↑↓←→");
  gotoxy(2*yy+4,20);
  printf("　　控制蛇的");
  gotoxy(2*yy+4,21);
  printf("　　　行進方向");
  gotoxy(2*yy+4,23);
  printf("　+ -");
  gotoxy(2*yy+4,24);
  printf("　　加速和減速");
  gotoxy(2*yy+4,26);
  printf("　Esc");
  gotoxy(2*yy+4,27);
  printf("　　　AI模式~");
  gotoxy(20,13);
  printf("請按任意鍵開始遊戲");
  ch[0] = getch();
  if(ch[0]==-32)
  {
    ch[1] = getch();
  }
  else if(ch[0]==27)
  {
    testing = 1;
  }
  gotoxy(20,13);
  printf("　　　　　　　   ");
  while(1)
  {
	Sleep(speedlist[speed]);
	blingcount+=speedlist[speed];
	if(speed<low_speed_limit)
	{
	  speed++;
	  gotoxy(2*yy+4,12);
      printf("　速度:%2d/19",speed+1);
	}
	if(blingcount>=300)
	{
	  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),14);
	  gotoxy(foody*2+2,foodx+1);
	  if(bling==0)
	    printf("★");
	  else
	    printf("☆");
	  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
	  blingcount=0;
	  bling=(bling+1)%2;
	}
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
  		  gotoxy(2*yy+4,27);
  		  printf("　　　AI模式~");
		}
	    else if(mode==1)
	    {
		  SetConsoleTitle("Mode : Auto");
  		  gotoxy(2*yy+4,27);
  		  printf("　　普通模式~");
		}
	  }
	  else if(ch[0]==-32)/*方向鍵*/
	  { 
  	    if(mode==0)
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
	  }
	  else if(ch[0]==43)/* + speed up*/
	  { 
		if(speed<18)
		  speed++;
		gotoxy(2*yy+4,12);
        printf("　速度:%2d/19",speed+1);
	  }
	  else if(ch[0]==45)/* - slow down*/
	  {
		if(speed>low_speed_limit)
		  speed--;
		gotoxy(2*yy+4,12);
  		printf("　速度:%2d/19",speed+1);
	  }
	  else if(ch[0]==32)/*Space*/
	    movepermit=(movepermit+1)%2;
	  else if(ch[0]==0&&ch[1]==59)/*F1*/
	  {
		snake=(snake+1)%3;
		if(snake==0)
		{
		  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
		  gotoxy(0,0+1);
		  for(a=0;a<xx;a++)
		  {
			printf("□");
		    for(b=0;b<yy;b++)
		    {
			  if(map[a][b]>20)
			  {
				SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),2);
			    printf("■");
			    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
			  }
			  else
			    printf("　");
			}
		    printf("\n");
		  }
		  gotoxy(2*foody+2,foodx+1);
		  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),14);
		  printf("★");
		  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
		}
	  }
	  else if(ch[0]==96||ch[0]==126)
	  {
		authordisplay=(authordisplay+1)%2;
		if(authordisplay==0)
		{
		  gotoxy(2*yy+4,5);
          printf("　　   By pi314 ");
		}
	    else
	    {
		  gotoxy(2*yy+4,5);
          printf("　　   By 池昌言");
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
	  /*check[]={上,下,左,右}*/  /*檢驗上下左右的可行性*/
	  /*-2 絕對不能走      -1 可以    n 狹窄*/
	  if(length>=((xx*yy)/18)*3)
	    roomjudge=1;
	  else if(length>=(xx*yy)/9)
	    roomjudge=2;
	  for(a=0;a<4;a++)
	    check[a]=-1;
	  if(headx>0)
	  {
	    for(a=0;a<xx;a++)
	      for(b=0;b<yy;b++)
	      {
		    if(map[a][b]!=0&&map[a][b]!=1)
		      FindPath[a][b]=-1;
		    else
  		      FindPath[a][b]=0;
		  }
	    if(FindPath[headx-1][heady]==-1)
	      check[0]=-2;
	    else
	    {
		  FindPath[headx][heady]=-1;
		  waterfilling(&FindPath[0][0],headx-1,heady,-1,-1,&map[0][0]);
	      test=0;
	      for(a=0;a<xx;a++)
	        for(b=0;b<yy;b++)
	          if(FindPath[a][b]>0)
		        test++;
	      if(test<length*roomjudge)
	        check[0]=test;
		}
	  }
	  else
	    check[0]=-2;
	  if(headx<xx-1)
	  {
	    for(a=0;a<xx;a++)
	      for(b=0;b<yy;b++)
	      {
		    if(map[a][b]!=0&&map[a][b]!=1)
		      FindPath[a][b]=-1;
		    else
  		      FindPath[a][b]=0;
		  }
	    if(FindPath[headx+1][heady]==-1)
	      check[1]=-2;
	    else
	    {
		  FindPath[headx][heady]=-1;
		  waterfilling(&FindPath[0][0],headx+1,heady,-1,-1,&map[0][0]);
	      test=0;
	      for(a=0;a<xx;a++)
	        for(b=0;b<yy;b++)
	          if(FindPath[a][b]>0)
		        test++;
	      if(test<length*roomjudge)
	        check[1]=test;
		}
	  }
	  else
	    check[1]=-2;
	  
	  if(heady>0)
	  {
	    for(a=0;a<xx;a++)
	      for(b=0;b<yy;b++)
	      {
		    if(map[a][b]!=0&&map[a][b]!=1)
		      FindPath[a][b]=-1;
		    else
  		      FindPath[a][b]=0;
		  }
	    if(FindPath[headx][heady-1]==-1)
	      check[2]=-2;
	    else
	    {
		  FindPath[headx][heady]=-1;
		  waterfilling(&FindPath[0][0],headx,heady-1,-1,-1,&map[0][0]);
	      test=0;
	      for(a=0;a<xx;a++)
	        for(b=0;b<yy;b++)
	          if(FindPath[a][b]>0)
		        test++;
	      if(test<length*roomjudge)
	        check[2]= test;
		}
	  }
	  else
	    check[2]=-2;
	  
	  if(heady<yy-1)
	  {
	    for(a=0;a<xx;a++)
	      for(b=0;b<yy;b++)
	      {
		    if(map[a][b]!=0&&map[a][b]!=1)
		      FindPath[a][b]=-1;
		    else
  		      FindPath[a][b]=0;
		  }
	    if(FindPath[headx][heady+1]==-1)
	      check[3]=-2;
	    else
	    {
		  FindPath[headx][heady]=-1;
		  waterfilling(&FindPath[0][0],headx,heady+1,-1,-1,&map[0][0]);
	      test=0;
	      for(a=0;a<xx;a++)
	        for(b=0;b<yy;b++)
	          if(FindPath[a][b]>0)
		        test++;
	      if(test<length*roomjudge)
	        check[3]= test;
		}
	  }
	  else
	    check[3]=-2;
	  
	  test=0;
	  for(a=0;a<4;a++)
	    if(check[a]==-1)/*-1  可以走*/
	      test++;
	  
	  if(testing)
	  {
	    gotoxy(0,0);
	    printf("上:%-7d",check[0]);
	    printf("下:%-7d",check[1]);
	    printf("左:%-7d",check[2]);
	    printf("右:%-7d",check[3]);
	  }/*****************測試段*****************/
	  if(test==0)/*四向均狹窄或不通，找最寬敞的方向*/
	  {
	    for(a=0;a<4;a++)
	      if(check[a]>check[test]&&check[a]!=-2)
		    test=a;
	    check[test]=-1;
	    for(a=0;a<4;a++)
	      if(check[a]!=-1)
	        check[a]=-2;/*其他的方向全都不考慮*/
	  }
	  /**/
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
	    test=-5;
	  if(headx>0&&FindPath[headx-1][heady]<FindPath[headx][heady]&&check[0]!=-1&&FindPath[headx-1][heady]>0)
	  {
		test=-5;
	  }
	  if(headx<xx-1&&FindPath[headx+1][heady]<FindPath[headx][heady]&&check[1]!=-1&&FindPath[headx+1][heady]>0)
	  {
   	    test=-5;
	  }
      if(heady>0&&FindPath[headx][heady-1]<FindPath[headx][heady]&&check[2]!=-1&&FindPath[headx][heady-1]>0)
	  {
   	    test=-5;
	  }
	  if(heady<yy-1&&FindPath[headx][heady+1]<FindPath[headx][heady]&&check[3]!=-1&&FindPath[headx][heady+1]>0)
	  {
   	    test=-5;
	  }
	  
	  if(test==-5)
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
		if(headx>0&&FindPath[headx-1][heady]<FindPath[headx][heady]&&check[0]!=-1&&FindPath[headx-1][heady]>0)
	    {
		  test=-5;
	    }
	    if(headx<xx-1&&FindPath[headx+1][heady]<FindPath[headx][heady]&&check[1]!=-1&&FindPath[headx+1][heady]>0)
	    {
   	      test=-5;
	    }
        if(heady>0&&FindPath[headx][heady-1]<FindPath[headx][heady]&&check[2]!=-1&&FindPath[headx][heady-1]>0)
	    {
   	      test=-5;
	    }
	    if(heady<yy-1&&FindPath[headx][heady+1]<FindPath[headx][heady]&&check[3]!=-1&&FindPath[headx][heady+1]>0)
	    {
   	      test=-5;
	    }
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
	      if(headx>0&&FindPath[headx-1][heady]<FindPath[headx][heady]&&check[0]!=-1&&FindPath[headx-1][heady]>0)
	      {
		    test=-5;
	      }
	      if(headx<xx-1&&FindPath[headx+1][heady]<FindPath[headx][heady]&&check[1]!=-1&&FindPath[headx+1][heady]>0)
	      {
   	        test=-5;
	      }
          if(heady>0&&FindPath[headx][heady-1]<FindPath[headx][heady]&&check[2]!=-1&&FindPath[headx][heady-1]>0)
	      {
   	        test=-5;
	      }
	      if(heady<yy-1&&FindPath[headx][heady+1]<FindPath[headx][heady]&&check[3]!=-1&&FindPath[headx][heady+1]>0)
	      {
   	        test=-5;
	      }
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
			  if(headx>0&&FindPath[headx-1][heady]<FindPath[headx][heady]&&check[0]!=-1&&FindPath[headx-1][heady]>0)
	          {
		        test=-5;
	          }
	          if(headx<xx-1&&FindPath[headx+1][heady]<FindPath[headx][heady]&&check[1]!=-1&&FindPath[headx+1][heady]>0)
	          {
   	            test=-5;
	          }
              if(heady>0&&FindPath[headx][heady-1]<FindPath[headx][heady]&&check[2]!=-1&&FindPath[headx][heady-1]>0)
	          {
   	            test=-5;
	          }
	          if(heady<yy-1&&FindPath[headx][heady+1]<FindPath[headx][heady]&&check[3]!=-1&&FindPath[headx][heady+1]>0)
	          {
   	            test=-5;
	          }
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
			    /*
			    if(headx>0&&FindPath[headx-1][heady]<FindPath[headx][heady]&&check[0]!=1&&FindPath[headx-1][heady]>0)
	            {
		          test=-5;
	            }
	            if(headx<xx-1&&FindPath[headx+1][heady]<FindPath[headx][heady]&&check[1]!=1&&FindPath[headx+1][heady]>0)
	            {
   	              test=-5;
	            }
                if(heady>0&&FindPath[headx][heady-1]<FindPath[headx][heady]&&check[2]!=1&&FindPath[headx][heady-1]>0)
	            {
   	              test=-5;
	            }
	            if(heady<yy-1&&FindPath[headx][heady+1]<FindPath[headx][heady]&&check[3]!=1&&FindPath[headx][heady+1]>0)
	            {
   	              test=-5;
	            }
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
	                int max=0;
			        for(a=0;a<xx;a++)
			          for(b=0;b<yy;b++)
			            if(FindPath[a][b]>max)
			            {
						  helpx=a;
						  helpy=b;
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
				    waterfilling(&FindPath[0][0],helpx,helpy,headx,heady,&map[0][0]);
				}/**/
			  }
			}
		  }
		}
	  }
	  /*
	  gotoxy(0+2,xx+1);
	  printf("%d",test);/**/
	  chk2=0;
	  if(FindPath[headx-1][heady]<FindPath[headx][heady]&&FindPath[headx-1][heady]!=0&&FindPath[headx-1][heady]!=-1&&headx>0&&check[0]==-1/**/)
	  {
		ch[1]=72;
		chk2=2;
		if(dirx==-1&&diry==0&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  if(FindPath[headx+1][heady]<FindPath[headx][heady]&&FindPath[headx+1][heady]!=0&&FindPath[headx+1][heady]!=-1&&headx<xx-1&&chk2!=1&&check[1]==-1/**/)
	  {
		ch[1]=80;
		chk2=2;
		if(dirx==1&&diry==0&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  if(FindPath[headx][heady+1]<FindPath[headx][heady]&&FindPath[headx][heady+1]!=0&&FindPath[headx][heady+1]!=-1&&heady<yy-1&&chk2!=1&&check[3]==-1/**/)
	  {
		ch[1]=77;
		chk2=2;
		if(dirx==0&&diry==1&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  if(FindPath[headx][heady-1]<FindPath[headx][heady]&&FindPath[headx][heady-1]!=0&&FindPath[headx][heady-1]!=-1&&heady>0&&chk2!=1&&check[2]==-1/**/)
	  {
		ch[1]=75;
		chk2=2;
		if(dirx==0&&diry==-1&&movepermit)
		{
		  setdir(ch[1],&map[headx][heady],&dirx,&diry);
		  chk2=1;
		}
	  }
	  if(chk2!=1&&movepermit)/*沒有立即的優先路線，保持方向直走*/
 	  {/*前面放chk2=2是為了避免影響到原本的動作*/
 	    if(dirx!=0)
 	    {
		  if(heady>0&&(map[headx][heady-1]==0||map[headx][heady-1]==1)&&re[(t+3)%5]==77)
		  {
			ch[1]=75;
		    setdir(ch[1],&map[headx][heady],&dirx,&diry);
		    test=5;
		  }
		  else if(heady<yy-1&&(map[headx][heady+1]==0||map[headx][heady+1]==1)&&chk2==0&&re[(t+3)%5]==75)
		  {
		    ch[1]=77;
			setdir(ch[1],&map[headx][heady],&dirx,&diry);
			test=5;
		  }
		}
		else if(diry!=0)
		{
		  if(headx>0&&(map[headx-1][heady]==0||map[headx-1][heady]==1)&&re[(t+3)%5]==80)
		  {
		    ch[1]=72;
			setdir(ch[1],&map[headx][heady],&dirx,&diry);
			test=5;
		  }
		  else if(headx<xx-1&&(map[headx+1][heady]==0||map[headx+1][heady]==1)&&chk2==0&&re[(t+3)%5]==72)
		  {
		    ch[1]=80;
			setdir(ch[1],&map[headx][heady],&dirx,&diry);
			test=5;
		  }
		}
		if(test!=5)
		  test=0;
		if(map[headx+dirx][heady+diry]!=1&&map[headx+dirx][heady+diry]!=0&&test!=5)
		  test=1;
		if(headx+dirx<0||headx+dirx>=xx||heady+diry<0||heady+diry>=yy&&test!=5)
		  test=1;
		if(test==1&&chk2==0)/*直走會撞牆*/
		{
		  tt=1;
		  if(dirx!=0)
		  {
		    if(heady>0&&(map[headx][heady-1]==0||map[headx][heady-1]==1))
		    {
			  ch[1]=75;
			}
			if(heady<yy-1&&(map[headx][heady+1]==0||map[headx][heady+1]==1)&&chk2==0)
			{
			  ch[1]=77;
			}
		  }
		  else if(diry!=0)
		  {
		    if(headx>0&&(map[headx-1][heady]==0||map[headx-1][heady]==1))
		    {
			  ch[1]=72;
			}
			if(headx<xx-1&&(map[headx+1][heady]==0||map[headx+1][heady]==1)&&chk2==0)
			{
			  ch[1]=80;
			}
		  }
		}
	    setdir(ch[1],&map[headx][heady],&dirx,&diry);
	  }
	}
	/*
	if(headx+dirx<0||headx+dirx>=xx||heady+diry<0||heady+diry>=yy||map[headx+dirx][heady+diry]>20)
      movepermit=0;/**/
	if(movepermit==1)
 	{
	  move(&headx,&heady,&tailx,&taily,dirx,diry,&map[0][0],&i_setfood);
	  if(dirx==-1)
	    re[t]=72;
	  else if(dirx==1)
	    re[t]=80;
	  else if(diry==-1)
	    re[t]=75;
	  else if(diry==1)
	    re[t]=77;
	  if(tt==1)
	  {
	    re[t]*=-1;
	    tt=0;
	  }
	  t=(t+1)%5;
	  /*
	  gotoxy(0,0);
	  for(a=0;a<5;a++)
	    printf("%d  ",re[(t+a)%5]);/**/
	}
	
	if(snake==1)
	{
	 gotoxy(0,0+1);
	 for(a=0;a<xx;a++)
	 {
	   printf("□");
	   for(b=0;b<yy;b++)
	   {
		 if(FindPath[a][b]==-1)
		 {
		   SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),32);
		   printf("%2d",map[a][b]);
		   SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
		 }
		 else
	     {
		   SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),8);
		   printf("%2d",FindPath[a][b]);
		   SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
		 }
	   }
	   printf("\n");
	 }
	}
	else if(snake==2)
	{
	 gotoxy(0,0+1);
	 SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),8);
	 for(a=0;a<xx;a++)
	 {
	   printf("□");
	   for(b=0;b<yy;b++)
	     printf("%2d",map[a][b]);
	   printf("\n");
	 }
	 SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
	}
	/*||map[headx][heady]>20*/
	if(headx<0||headx>=xx||heady<0||heady>=yy||map[headx][heady]>20)
      if(testing==1)
	    movepermit=0;
	  else
	    break;
  }/*game's main loop end*/
  gotoxy(0,xx+2+2);
  printf("請按 Space 結束遊戲 >>\n\n");
  do
  {
    ch[0]=getch();
  }while(ch[0]!=32);
  printf("┌──11/21 ──────────┐\n");
  printf("│ Snake_III_0.exe  貪吃蛇 3.0  │\n");
  printf("└┬──────────────┴──────────┐\n");
  printf("  │http://www.cs.nctu.edu.tw/~cychih/Snake_III_0.exe │\n");
  printf("  └─────────────────────────┘\n\n");
  printf("特別感謝: ──────────────────────┐\n");
  printf("│2010/11/22 ex860抓出按下行進反方向會直接死亡的bug.  │\n");
  printf("│--> 修改為Snake_III_1.exe                           │\n");
  printf("└──────────────────────────┘\n\n");
  printf("特別感謝：───────────────────┐\n");
  printf("│在配色上採用CMturtle在2008年的作品\"追閃蛇\".   │\n");
  printf("├ - - - - - - - - - - - - - - - - - - - - - - -┤\n");
  printf("│11/26加強預防進入死巷的判斷能力。             │\n");
  printf("│11/29微幅加強走出死巷的能力。                 │\n");
  printf("│11/30加上計分系統。                           │\n");
  printf("│--> 修改為Snake_III_2.exe                     │\n");
  printf("└───────────────────────┘");
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
   gotoxy(2*(*pheady)+2,(*pheadx)+1);
   SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),2);
   printf("■");
   SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
  *pheadx+=dirx;
  *pheady+=diry;
  
  gotoxy(2*(*pheady)+2,(*pheadx)+1);
  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),10);
  printf("■");
  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
  if(*(pmap+(*pheadx)*yy+(*pheady))==1)
  {
    *pi_setfood=1;
    length++;
    gotoxy(2*yy+4,11);
    printf("　長度:%4d",length);
    if((length-3)%7==0)
    {
	  if(testing==0&&low_speed_limit<18)
	    low_speed_limit++;
	}
	point+=(low_speed_limit+1)*(int)sqrt(length);
    gotoxy(2*yy+4,13);
    printf("　分數:%4d",point);
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
	gotoxy(2*(*ptaily)+2,(*ptailx)+1);
	printf("　");
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
  gotoxy(2*(*pfoody)+2,(*pfoodx)+1);
  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),14);
  printf("★");
  SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE),7);
  *pfoodpx=*pfoodx;
  *pfoodpy=*pfoody;
}
