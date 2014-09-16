#include <windows.h>
#include <stdio.h>

int main(int argc, char *argv[]){
    POINT p;
    int i,j;
    int dx=1;//Y座標每次移動單位
    int dy=1;//C座標每次移動單位
    int t=10;//每次移動間隔(毫秒)
    int posx, posy;
    char trace;
    int cont;
    bool pressLeft;
    bool pressRight;
    int mvx,mvy;
    int mulPtr;
    int mulPtrDelta;
    int temp;
    char titleStr[] = "On  - _";

	trace = 1;
	cont = 0;
	pressLeft = false;
	pressRight = false;
	printf("分枝版本:\n");
	printf("=======\n");
    printf("Mouse Board for minecraft v0.2\n");
    printf("2012/06/30 00:29\n");
    printf("    pi314@NCTU\n\n");
    
	printf("控制:\n");
	printf("=======\n");
	printf("移動     : 方向鍵\n");
	printf("低速移動 : 方向鍵 + 左 Shift\n");
	printf("偵測     : Alt\n");
	printf("滑鼠左鍵 : 右 Ctrl (此版本有加上左 Ctrl)\n");
	printf("滑鼠右鍵 : End 鍵\n\n");
	
    GetCursorPos(&p);
    SetCursorPos(100000,100000);
    GetCursorPos(&p);
    SetCursorPos(p.x/2, p.y/2);
    mulPtr = 1;
    titleStr[6] = '1';
    SetConsoleTitle(titleStr);
    while(true){
        GetCursorPos(&p);
        if(trace)
        {
            if(GetAsyncKeyState(VK_LSHIFT))
                mulPtrDelta = 1;
            else
                mulPtrDelta = 2;
            
            if(GetAsyncKeyState(VK_PRIOR) && mulPtr < 8 && cont == 0){
                mulPtr++;
                titleStr[6]++;
                SetConsoleTitle(titleStr);
                cont = 15;
            }
            if(GetAsyncKeyState(VK_NEXT) && mulPtr > 0 && cont == 0){
                mulPtr--;
                titleStr[6]--;
                SetConsoleTitle(titleStr);
                cont = 15;
            }
            
            mulPtrDelta += mulPtr;
            if(GetAsyncKeyState(VK_UP))//UP
                mvy+=dy*(-1)*mulPtrDelta;
            if(GetAsyncKeyState(VK_LEFT))//left
                mvx+=dx*(-1)*mulPtrDelta;
            if(GetAsyncKeyState(VK_RIGHT))//right
                mvx+=dx*mulPtrDelta;
            if(GetAsyncKeyState(VK_DOWN))//down
                mvy+=dy*mulPtrDelta;
            if(GetAsyncKeyState(VK_END) || GetAsyncKeyState(VK_RCONTROL) || GetAsyncKeyState(VK_LCONTROL))
            {
                if(GetAsyncKeyState(VK_RCONTROL) || GetAsyncKeyState(VK_LCONTROL))//mouse left
                {
                    if(!pressLeft)
                    {
                        mouse_event(MOUSEEVENTF_LEFTDOWN,p.x,p.y,0,0);
                        pressLeft = true;
                        SetConsoleTitle("Mouse Left Pressing!!");
                    }
                    cont = 9;
                }
                if(GetAsyncKeyState(VK_END))//mouse right
                {
                    if(!pressRight)
                    {
                        mouse_event(MOUSEEVENTF_RIGHTDOWN,p.x,p.y,0,0);
                        pressRight = true;
                        SetConsoleTitle("Mouse Right Pressing!!");
                    }
                    cont = 9;
                }
            }
            else
            {
                if(pressLeft)
                {
                    mouse_event(MOUSEEVENTF_LEFTUP,p.x,p.y,0,0);
                    pressLeft = false;
                    SetConsoleTitle(titleStr);
                }
                if(pressRight)
                {
                    mouse_event(MOUSEEVENTF_RIGHTUP,p.x,p.y,0,0);
                    pressRight = false;
                    SetConsoleTitle(titleStr);
                }
            }
        }
        if(GetAsyncKeyState(VK_MENU) && cont == 0)
        {
            trace = (trace+1)%2;
            if(trace == 0){
                titleStr[0] = 'O';
                titleStr[1] = 'f';
                titleStr[2] = 'f';
                SetConsoleTitle(titleStr);
            }
            else{
                titleStr[0] = 'O';
                titleStr[1] = 'n';
                titleStr[2] = ' ';
                SetConsoleTitle(titleStr);
            }
            cont = 15;
        }
        GetCursorPos(&p);
        SetCursorPos(p.x+mvx,p.y+mvy);
        mvx=0;
        mvy=0;
        GetCursorPos(&p);
        printf("(%-4d,%4d) [cont:%2d]  [速度:%2d]\r",p.x,p.y, cont, mulPtr);
        Sleep(t);
        if(cont > 0)
            cont--;
    }
}
