#!/bin/sh
_cmdList=`echo ${PATH} | tr ':' ' '`
while [ 1 -eq 1 ]
do
#_cmdList=`ls ${_temp}`
    _host=`hostname | cut -d"." -f1`
    _home=`echo /usr${HOME}`
    _pwd=`echo ${PWD}`
    if [ ${_home} = ${_pwd} ]; then
        fprompt="\033[1;36m"`date +"%H:%M"`" \033[1;33m"`whoami`"\033[m"O"\033[1;37m"${_host}" \033[1;32m[~]\033[m >"
    else
        dir=`echo ${_pwd} | awk -F"${_home}" -v here=${_pwd} '{
                if($2 == "")
                {
                    print $1;
                }
                else
                {
                    print "~" $2;
                }
             }'`
        fprompt="\033[1;36m"`date +"%H:%M"`" \033[1;33m"`whoami`"\033[m"O"\033[1;37m"${_host}" \033[1;32m["${dir}"]\033[m >"
    fi
    printf "${fprompt}" 2>/dev/null
    trap 'echo XDD' 3
    read line
#echo ${_temp} > tempCmd
    if [ -z "${line}" ]; then
    else
        echo ${line} | tr ';&|' '\n\n\n' |
            awk '{if($0 != ""){printf $1 " ";system("grep " $1 " /sbin || grep " $1 " /bin || grep " $1 " /usr/bin || grep " $1 " /usr/sbin || grep " $1 " /usr/local/bin || grep " $1 " /usr/local/sbin");printf "\n"}}' |
            awk '{if($2 == "Binary"){print $1 ": Permission denined."}else if($0 != ""){print $1 ": Command not found."}}'
        
    fi
#rm tempCmd
done
