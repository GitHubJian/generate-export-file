import {program} from 'commander';
import generate, {GenerateOptions} from '.';

program.version(require('../package.json').version).usage('[options]');

program
    .description('自动生成 Export 文件')
    .option('--folder <folder>', '需要生成 Export 文件夹')
    .option('--cwd <path>', '执行上下文', process.cwd())

    .option('--tool <tool>', '工具库类型', 'util')
    .option('--filetype <filetype>', '查找文件类型', 'js')
    .option(
        '--export-content-target <exportContentTarget>',
        '生成文件的类型',
        'module'
    )
    .option('--export-filename <exportFilename>', '导出文件名称类型', 'index')
    .option(
        '--export-content-type <exportContentType>',
        '导出文件内容类型',
        'independent'
    )
    .option('--export-filetype <exportFiletype>', '导出文件类型', 'js')

    .option('--ignore <ignore>', '忽略文件前缀', '_')
    .action(async cmd => {
        try {
            const options: GenerateOptions = {
                cwd: cmd.cwd,
                tool: cmd.tool,
                filetype: cmd.filetype,
                exportFilename: cmd.exportFilename,
                exportContentType: cmd.exportContentType,
                exportContentTarget: cmd.exportContentTarget,
                exportFiletype: cmd.exportFiletype,
                ignore: cmd.ignore,
            };

            await generate(cmd.folder, options);
        } catch (e: any) {
            console.error(e.message);

            process.exit(1);
        }
    });

program.on('--help', () => {
    console.log();
});

program.parse(process.argv);
