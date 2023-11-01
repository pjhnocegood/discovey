#!/bin/bash

# 종료하려는 프로세스명을 지정합니다
PROCESS_NAME="app.js"

# 해당 프로세스명을 가진 모든 프로세스를 종료합니다
pkill -f "$PROCESS_NAME"

# 종료된 프로세스 수를 확인합니다
terminated_processes=$?

if [ $terminated_processes -eq 0 ]; then
  echo "프로세스 $PROCESS_NAME 종료됨"
else
  echo "프로세스 $PROCESS_NAME을 종료하는 중 오류가 발생했습니다."
fi