#include <windows.h>
#include <stdio.h>

int main(int argc, char *argv[]){
    POINT p;
    int i,j;
    int dx=10;//Y座標每次移動單位
    int dy=10;//C座標每次移動單位
    int t=30;//每次移動間隔(毫秒)
    int delay=3;
    int posx, posy;
    char trace;
    int cont;
    bool pressLeft;
    bool pressRight;
    int mvx,mvy;
    int mulPtr;
    int mulPtrDelta;
    int temp;

	trace = 1;
	SetConsoleTitle("On");
	cont = 0;
	pressLeft = false;
	pressRight = false;
	printf("Control:\n");
	printf("Move  Mouse       : k, h, l, j  and arrow keys\n");
	printf("Low   Speed Move  : k, h, l, j  and arrow keys with Shift key\n");
	printf("Detection         : Esc\n");
	printf("Mouse Left  Click : Left Ctrl\n");
	printf("Mouse Right Click : Right Ctrl\n");
    GetCursorPos(&p);
    SetCursorPos(100000,100000);
    GetCursorPos(&p);
    SetCursorPos(p.x/2, p.y/2);
    mulPtr = 0;
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
                cont = 5;
            }
            if(GetAsyncKeyState(VK_NEXT) && mulPtr > 0 && cont == 0){
                mulPtr--;
                cont = 5;
            }
            
            mulPtrDelta += mulPtr;
            if(GetAsyncKeyState('K') || GetAsyncKeyState(VK_UP))//UP
                mvy+=dy*(-1)*mulPtrDelta;
            if(GetAsyncKeyState('H') || GetAsyncKeyState(VK_LEFT))//left
                mvx+=dx*(-1)*mulPtrDelta;
            if(GetAsyncKeyState('L') || GetAsyncKeyState(VK_RIGHT))//right
                mvx+=dx*mulPtrDelta;
            if(GetAsyncKeyState('J') || GetAsyncKeyState(VK_DOWN))//down
                mvy+=dy*mulPtrDelta;
            if(GetAsyncKeyState(VK_CONTROL))
            {
                if(GetAsyncKeyState(VK_LCONTROL))
                {
                    if(!pressLeft)
                    {
                        mouse_event(MOUSEEVENTF_LEFTDOWN,p.x,p.y,0,0);
                        pressLeft = true;
                        SetConsoleTitle("Mouse Left Pressing!!");
                    }
                    cont = 3;
                }
                if(GetAsyncKeyState(VK_RCONTROL))
                {
                    if(!pressRight)
                    {
                        mouse_event(MOUSEEVENTF_RIGHTDOWN,p.x,p.y,0,0);
                        pressRight = true;
                        SetConsoleTitle("Mouse Right Pressing!!");
                    }
                    cont = 3;
                }
            }
            else
            {
                if(pressLeft)
                {
                    mouse_event(MOUSEEVENTF_LEFTUP,p.x,p.y,0,0);
                    pressLeft = false;
                    SetConsoleTitle("On");
                }
                if(pressRight)
                {
                    mouse_event(MOUSEEVENTF_RIGHTUP,p.x,p.y,0,0);
                    pressRight = false;
                    SetConsoleTitle("On");
                }
            }
        }
        if(GetAsyncKeyState(VK_ESCAPE) && cont == 0)
        {
            trace = (trace+1)%2;
            if(trace == 0)
                SetConsoleTitle("Off");
            else
                SetConsoleTitle("On");
            cont = 5;
        }
        GetCursorPos(&p);
        SetCursorPos(p.x+mvx,p.y+mvy);
        mvx=0;
        mvy=0;
        GetCursorPos(&p);
        printf("(%-4d,%4d)   %2d  %2d\r",p.x,p.y, cont, mulPtr);
        Sleep(t);
        if(cont > 0)
            cont--;
    }
}
