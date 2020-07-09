

vm : vm.c rapl.o
	gcc -O2 -Wall -o vm vm.c rapl.o -lm
	chmod 777 vm

proxy : proxy.c rapl.o
	gcc -O2 -Wall -o proxy proxy.c rapl.o -lm
	chmod 777 proxy

rapl.o : rapl.c rapl.h
	gcc -O2 -Wall -c rapl.c  -lm

clean:
	rm -rf vm rapl.o proxy
