command! -nargs=1 -complete=file RaceTo :call SetupVimRaces(<q-args>)

function! SetupVimRaces(targetFile)
    split
    norm j
    bnext
    norm k
    let s:vimRacesTarget = a:targetFile
    augroup VimRace
        autocmd!
        autocmd BufWritePost * call CompareVimRaces()
    augroup END
endfunction

function! CompareVimRaces()
    execute("silent! !diff % ".s:vimRacesTarget)
    redraw!
    if v:shell_error == 0
        wqa
    else
        echo "before/after don't match!"
    endif
endfunction
