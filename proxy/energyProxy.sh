sudo modprobe msr

for request in $(ls Requests)
do
	sudo ./RAPL/proxy $NODE uncarbonize.js "Requests/$request" NodeProxy $request
done
