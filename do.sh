#!/bin/bash

ask_to_continue() {
    while true; do
        read -p "Do you want to continue? (y/n) " answer
        case $answer in
            [Yy]* ) echo -e "\033[32m✓ Continuing...\033[0m"; break;; # If yes, break from the loop and continue the script
            [Nn]* ) echo -e "\033[31m✖ Exiting script.\033[0m"; exit;; # If no, exit the script
            * ) echo "Please answer yes or no.";; # If invalid response, ask again
        esac
    done
}

check_container_running() {
    docker ps | grep "$1" > /dev/null
    return $?
}

echo "\033[1;34mThe 'DO' script for BPM, will start up any dependency containers to the application, if you agree and if they are not already running.\033[0m"
ask_to_continue

# Check if Redis container is already running
check_container_running redis-bpm
if [ $? -eq 0 ]; then
    echo "\033[32m✓ Redis container is already running.\033[0m"
else
    read -p "Redis container is not running. Do you want to run a Redis container? (y/n) " answerRedis
    if [[ ${answerRedis:0:1} == [yY] ]]; then
        docker run --name redis-bpm -d -p 6379:6379 redis
        if [ $? -ne 0 ]; then
            echo "\033[31m✖ Failed to run Redis container.\033[0m"
        else
            echo "\033[32m✓ Redis container is running on port 6379.\033[0m"
        fi
    else
        echo "\033[33mSkipping Redis container.\033[0m"
    fi
fi

# Check if MySQL container is already running
check_container_running mysql-bpm
if [ $? -eq 0 ]; then
    echo "\033[32m✓ MySQL container is already running.\033[0m"
else
    read -p "MySQL container is not running. Do you want to run a MySQL container? (y/n) " answerMysql
    if [[ ${answerMysql:0:1} == [yY] ]]; then
        $MYSQL_ROOT_PASSWORD="my-secret-pw"
        docker run --name mysql-bpm -e MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD -d -p 3306:3306 mysql
        if [ $? -ne 0 ]; then
            echo "\033[31m✖ Failed to run MySQL container.\033[0m"
        else
            echo "\033[32m✓ MySQL container is running on port 3306.\033[0m"

            until docker exec mysql-bpm mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "SELECT 1" > /dev/null 2>&1; do
                echo "Waiting for MySQL to be ready..."
                sleep 1
            done
            echo "\033[32m✓ MySQL is ready.\033[0m"

            docker exec mysql-bpm mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD'"
            docker exec mysql-bpm mysql -uroot -p$MYSQL_ROOT_PASSWORD -e "FLUSH PRIVILEGES"
        fi
    else
        echo "\033[33mSkipping MySQL container.\033[0m"
    fi
fi

# Ensure the script runs in its own directory
cd "$(dirname "$0")"

echo "\033[1;34mInstalling dependencies...\033[0m"
npm install && echo "\033[32m✓ Dependencies installed successfully.\033[0m" || echo "\033[31m✖ Failed to install dependencies.\033[0m"

echo "\033[1;34mStarting the BPM application...\033[0m"
npm start && echo "\033[32m✓ BPM application started successfully.\033[0m" || echo "\033[31m✖ Failed to start the BPM application.\033[0m"
