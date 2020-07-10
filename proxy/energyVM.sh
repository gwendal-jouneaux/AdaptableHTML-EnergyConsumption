sudo modprobe msr

for page in $(ls HTML)
do
	echo "Starting $page evaluation"
	sudo ./RAPL/vm "$JAVA_HOME" "HTML/$page" HTML $page > /dev/null 2>/dev/null
	echo "$page DONE"
done
