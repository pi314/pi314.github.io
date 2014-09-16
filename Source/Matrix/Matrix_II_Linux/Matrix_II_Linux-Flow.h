class Flow
{
    int y;
    int up, down;
    int length;
    int head, tail;
    int uniqe;
    int size;
    char eggStr[30];
    int read;
    
    bool state;
    public:
        Flow()
        {
            state = false;
        }
        void turnOn(bool occupied[Deepth][Width], int &egg, char interactionEgg[30])
        {
            int yr, upr, downr, lengthr;
            uniqe = rand()%UniqeRate;
            if(egg > 0)
                uniqe = 0;
            if(uniqe == 0)
            {
                strcpy(eggStr, interactionEgg);
                
                int eggLength = strlen(eggStr);
                if(eggLength == 0)
                {
                    strcpy(eggStr, "pi314");
                    eggLength = 5;
                }
                yr = rand()%Width;
                upr = rand()%(Deepth - eggLength);
                downr = upr + eggLength - 1;
                for(int a = 0; a < eggLength; a++)
                {
                    if(eggStr[a] < 0)
                    {
                        downr--;
                        a++;
                    }
                }
                lengthr = eggLength * 3;
            }
            else
            {
                yr = rand()%Width;
                upr = rand()%(Deepth/2);
                downr = rand()%(Deepth - (upr+3)) + upr+3;
                lengthr = rand()%Deepth;
            }
            int a;
            bool flag = true;
            for(a = upr; a <= downr; a++)
            {
                if(occupied[a][yr])
                {
                    flag = false;
                    break;
                }
            }
            if(flag)
            {
                state = true;
                y = yr;
                up = upr;
                 head = up;
                down = downr;
                length = lengthr;
                size = rand()%3;
                for(a = up; a <= down; a++)
                {
                    if(up < 0 || up >= Deepth || down < 0 || down >= Deepth || y < 0 || y >= Width)
                    {
                        cout<<"this program has some proplem,\npress any key to end the program>>";
                        getch();
                        exit(1);
                    }
                    occupied[a][y] = true;
                }
                if(uniqe == 0)
                {
                    read = 0;
                    if(egg > 0)
                        egg--;
                }
            }
        }
        void turnOff(bool occupied[Deepth][Width])
        {
            int a;
            for(a = up; a <= down; a++)
            {
                if(up < 0 || up >= Deepth || down < 0 || down >= Deepth || y < 0 || y >= Width)
                {
                    cout<<"this program has some proplem,\npress any key to end the program>>";
                    getch();
                    exit(1);
                }
                occupied[a][y] = false;
            }
            state = false;
        }
        bool working()
        {
            return state;
        }
        void timeFlow(char *str[3][62], bool occupied[Deepth][Width])
        {
            if(!state)
                return;
            if(uniqe == 0)
                color(14);
            else if(uniqe <= UniqeRate/10)
                color(10);
            else
                color(2);
            if(size < 0 || size >= 3)
            {
                cout<<"this program has some proplem,\npress any key to end the program>>";
                getch();
                exit(1);
            }
            tail = head-length;
            if(head <= down)
            {
                gotoxy(head, y);
                if(uniqe == 0)
                {
                    cout<<eggStr[read];
                    if(eggStr[read] <= 0)
                    {
                        read++;
                        cout<<eggStr[read];
                    }
                    read++;
                }
                else
                    cout<<str[size][rand()%62];
            }
            if(tail >= up && tail <= down)
            {
                gotoxy(tail, y);
                cout<<"  ";
            }
            if(tail > down)
            {
                this->turnOff(occupied);
            }
            head++;
        }
};
