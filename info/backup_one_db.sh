#!/bin/bash

backup_file_name=`date +%Y%m%d`
backup_destination="/home/sangram/workspace/db_backup/postgres/dbname"
archieve_destination="/home/sangram/workspace/db_backup/postgres/dbname/archive"
len=${#backup_destination}
 
sudo -u postgres psql -t -c "SELECT datname FROM pg_database where datistemplate = false and datname !='postgres'"| while read -a Record ; 
do
if [[ ${Record[0]} = *[!\ ]* ]]; then
	archieve_destination="$archieve_destination/dbname_$backup_file_name.tar.gz"

	cmd_to_run="sudo -u postgres pg_dump -U postgres ${Record[0]} -f $backup_destination/${Record[0]}_$backup_file_name.sql"
	$cmd_to_run

	while [ ! -f "$backup_destination/dbname_$backup_file_name.sql" ]
	do
          echo "waiting ..."
	  sleep 2
	done

	cmd_to_run="sudo tar -P -zcvf $archieve_destination --transform $backup_destination/${Record[0]}_$backup_file_name.sql"
	#$cmd_to_run
	echo $cmd_to_run
fi
done
exit
