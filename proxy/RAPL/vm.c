#define _GNU_SOURCE

#include <stdio.h>
#include <time.h>
#include <math.h>
#include <string.h>
#include <unistd.h>
#include <sched.h>
#include <sys/types.h>
#include <signal.h>
#include <stdlib.h>
#include "rapl.h"

#define RUNTIME 1


int main (int argc, char **argv, char *env[] ) 
{ char command[500]="",param[500]="",language[500]="", test[500]="", path[500]="";
  char cp[4]="-cp", cpParam[500]="", fqn[50]="fr.gjouneau.truffle.HTML.launcher.HTML_Launcher";
  char module1[25]="--conditional-loading", module2[20]="--loop-perforation";
  int  ntimes = 10;
  int  core = 0;
  int  i=0;

#ifdef RUNTIME
  //clock_t begin, end;
  double time_spent;
  struct timeval tvb,tva;
#endif
  
  FILE * fp;

//  strcpy(command, "./" );

  // get the executable to run the scripts
  strcat(command,argv[1]);
  strcat(command, "/bin/java");


  strcat(cpParam, argv[1]);
  strcat(cpParam, "/bin/../languages/html/launcher/HTML-launcher.jar");


  // Get the monitored script path
  strcat(param,argv[2]);
  
  //Language name
  strcpy(path,"./");


  strcpy(language,argv[3]);
  strcat(language,".csv");
  strcat(path,language);
  //Test name
  strcpy(test,argv[4]);

  //ntimes = atoi (argv[2]);

  fp = fopen(path,"a");
  rapl_init(core);


  //fprintf(fp,"Package , CPU , GPU , DRAM? , Time (sec) \n");
  
  for (i = 0 ; i < ntimes ; i++)
    {  
 
    	fprintf(fp,"%s ; ",test);
 	
	      
		#ifdef RUNTIME
		        //begin = clock();
				gettimeofday(&tvb,0);
		#endif

    int status;
	  pid_t pid = fork();
    switch( pid )
    {
        case -1:   // fork failed
            perror( "fork failed" );
            exit( EXIT_FAILURE );
            break;

        case 0:;    // child process
            system("export ADAPTABLE_HTML_ENERGY=100");
            system("export ADAPTABLE_HTML_ACCURACY=0");
            cpu_set_t set;
            CPU_ZERO(&set);        // clear cpu mask
            CPU_SET(0, &set);      // set cpu 0
            sched_setaffinity(0, sizeof(cpu_set_t), &set);
            char *tab[] = { command, cp, cpParam, fqn, param, module1, module2, NULL };
            execve( command, tab, env );   // does not return unless an error
            perror("execve failed");
            exit( EXIT_FAILURE );
            break;

        default:

            rapl_before(fp,core);
    
            waitpid( pid, &status, 0 );

            rapl_after(fp,core);
            break;
    }
	
    

		#ifdef RUNTIME
			//end = clock();
			//time_spent = (double)(end - begin) / CLOCKS_PER_SEC;
			gettimeofday(&tva,0);
			time_spent = (tva.tv_sec-tvb.tv_sec)*1000000 + tva.tv_usec-tvb.tv_usec;
			time_spent = time_spent / 1000;
		#endif

    kill(pid, SIGKILL);	

		#ifdef RUNTIME	
			fprintf(fp," %G \n",time_spent);
		#endif	
    }
    

  fclose(fp);
  fflush(stdout);

  return 0;
}



