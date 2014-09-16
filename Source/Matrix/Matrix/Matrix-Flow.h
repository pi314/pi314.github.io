class Flow
{
    int y;
    int up, down;
    int length;
    int size;
    bool working;
    int head;
    int uniqe;
    char egg[41];
    int read;
    int jump;
    public:
        Flow()
        {
            working = false;
        }
        void turnOn(int yInput, int upInput, int downInput, int lInput, char * occupied[downAllow][allowing], int eggwave)
        {
            y = yInput;
            up = upInput;
             head = up;
            down = downInput;
            length = lInput;
            working = true;
            size = rand()%3;
            uniqe = rand()%150;
            for(int a = up - 1; a <= down + 1; a++)
            {
                if(a >=0 && a < downAllow)
                {
                    occupied[a][y] = "||";
                }
            }
            if(eggwave > 0)
                uniqe = 0;
            if(uniqe == 0)
            {
                FILE *fptr;
                for(int a = 0; a < 41; a++)
                {
                    egg[a] = 0;
                }
                if((fptr = fopen("matrix.txt","r"))!=NULL)
                {
                    fgets(egg, 40, fptr);
                }
                else
                {
                    strcpy(egg, "pi314");
                }
                
                down = up + strlen(egg) + 2;
                if(down >= downAllow)
                {
                    down = downAllow - 1;
                    up = down - strlen(egg) - 2;
                }   
                length = strlen(egg)*3;
                read = 0;
                jump = 0;
            }
        }
        void turnOff(char * occupied[downAllow][allowing])
        {
            working = false;
            for(int a = up - 1; a <= down + 1; a++)
            {
                if(a >=0 && a < downAllow)
                {
                    occupied[a][y] = NULL;
                }
            }
        }
        bool online()
        {
            return working;
        }
        void timeFlow(char * str[3][62], char * occupied[downAllow][allowing])
        {
            if(!working)
                return;
            
            head++;
            int tail = head - length;
            if(head < down)
            {
                int r = rand()%62;
                gotoxy(head, y);
                if(uniqe == 0)
                {
                    color(14);
                    cout<<egg[read];
                    read++;
                    if(egg[read - 1] < 0)
                    {
                        cout<<egg[read];
                        read++;
                    }
                }
                else
                {
                    color(2);
                    cout<<str[size%3][r%62];
                }
                occupied[head][y] = str[size%3][r%62];
            }
            if(tail > down)
            {
                this->turnOff(occupied);
            }
            else if(tail > up)
            {
                gotoxy(tail, y);
                cout<<"  ";
                occupied[tail][y] = "==";
            }
        }
};
