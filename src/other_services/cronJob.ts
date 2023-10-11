import { CronJob } from 'cron';
import { exec } from 'child_process';

const job = new CronJob(
	'2 * * * * *',
	function () {
	    exec(`bash ./backup.sh`, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
            }
            console.log(stdout);
        })
    },
	function () {
        console.log('cron job stopped')
        },
	true,
    "Europe/Copenhagen"
);

export default job;