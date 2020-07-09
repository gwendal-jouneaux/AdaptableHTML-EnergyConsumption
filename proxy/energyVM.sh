sudo modprobe msr

for page in $(ls HTML)
do
	sudo ./RAPL/vm "$JAVA_HOME" "HTML/$page" HTML $page
done
