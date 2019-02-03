class TimersManager {
    constructor() {
        this.timers = [];
        this.started = false;
        this.added = [];
        this.log = [];
    }

    add(timerParameters, ...args) {
        if (this.started === true) {
            throw new Error('Timers is already started');
        }

        const timers = this.timers;
        const added = this.added;
        const { name, delay, interval, job } = timerParameters;

        const ifAdded = this.added.some((id) => id === name);
        this.checker(name, delay, interval, job);
        if (ifAdded) {
            throw new Error('Name already exists');
        }

        timers.push({ name, delay, interval, job, args });

        added.push(name);

        return this;
    }

    remove(id) {
        const timers = this.timers;
        const added = this.added;
        this.timers = timers.filter((timer) => timer.name !== id);
        this.added = added.filter((name) => name !== id);
        const [ timerToRemove ] = timers.filter((timer) => timer.name === id);
        clearTimeout(timerToRemove.timeout);
    }

    start() {
        const [ ...timers ] = this.timers;
        const boundLog = this._log.bind(this);
        this.started = true;
        let maxDelay = 0;

        timers.forEach((timer) => {
            const { name, delay, interval, job, args } = timer;
            maxDelay = maxDelay < delay ? delay : maxDelay;
            timer.timeout = setTimeout(function tick() {
                const created = new Date();
                let out = '';
                try {
                    out = job(...args);
                    boundLog({ name, args, out, created });
                } catch (error) {
                    const errorObj = {
                        name:    error.name,
                        message: error.message,
                        stack:   error.stack,
                    };
                    boundLog({ name, args, out, error: errorObj, created });
                }

                if (interval) {
                    timer.timeout = setTimeout(tick, delay);
                }
            }, delay);
        });

        setTimeout(() => {
            this.stop();
            console.log('→ stop(max + 10)');
        }, maxDelay + 10000);
    }

    stop() {
        if (this.started) {
            const [ ...timers ] = this.timers;
            timers.forEach((timer) => {
                clearTimeout(timer.timeout);
            });
        }
    }

    pause(id) {
        if (this.started) {
            const timers = this.timers;

            const [ timerToStop ] = timers.filter((timer) => timer.name === id);
            clearTimeout(timerToStop.timeout);
        }
    }

    resume(id) {
        if (this.started) {
            const timers = this.timers;
            const boundLog = this._log.bind(this);

            const [ timerToStart ] = timers.filter((timer) => timer.name === id);
            const { name, delay, interval, job, args } = timerToStart;

            timerToStart.timeout = setTimeout(function tick() {
                const created = new Date();
                let out = '';
                try {
                    out = job(...args);
                    boundLog({ name, args, out, created });
                } catch (error) {
                    const errorObj = {
                        name:    error.name,
                        message: error.message,
                        stack:   error.stack,
                    };
                    boundLog({ name, args, out, error: errorObj, created });
                }

                if (interval) {
                    timerToStart.timeout = setTimeout(tick, delay);
                }
            }, delay);
        }
    }

    checker(name, delay, interval, job) {
        if (typeof name !== 'string' || !name.trim()) {
            throw new Error('Name must be a string');
        }
        if (typeof delay !== 'number' || delay < 0 || delay > 5000) {
            throw new Error('Delay must be a number from 0 to 5000');
        }
        if (typeof interval !== 'boolean') {
            throw new Error('Interval must be a boolean');
        }
        if (typeof job !== 'function') {
            throw new Error('Job must be a function');
        }
    }

    _log(...args) {
        args.forEach((item) => {
            this.log.push(item);
        });
    }

    print() {
        process.on('exit', () => {
            console.log(this.log);

            return this.log;
        });
    }
}

const manager = new TimersManager();
const t1 = {
    name:     't1',
    delay:    5000,
    interval: false,
    job:      (n) => {
        console.log(`t1 done!! Result ${n}`);

        return n;
    },
};
const t2 = {
    name:     't2',
    delay:    3000,
    interval: true,
    job:      (a, b) => {
        console.log(`t2 done!! Result ${a + b}`);

        return a + b;
    },
};

const t3 = {
    name:     't3',
    delay:    2000,
    interval: false,
    job:      () => {
        console.log('t3 before Error');
        throw new Error('t3 We have a problem!');
    },
};

manager
    .add(t1, 5)
    .add(t2, 1, 2)
    .add(t3);

manager.remove('t2');
manager.add(t2, 1, 2);

manager.start();

manager.pause('t1');
manager.resume('t1');

manager.print();
// manager.stop()

console.log('→Message in end of the file1');
