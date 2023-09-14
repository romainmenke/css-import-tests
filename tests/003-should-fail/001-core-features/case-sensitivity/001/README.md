url paths are case sensitive

In bundlers it is non-trivial to correctly read only files which are a case sensitive match.  
Depending on the file system of the end user this might give the correct or wrong result.

One possible way to validate this is to scan the parent directory and then check if the file is in the list.  
This is a slow process.

Better to leave it up to a linter to aid CSS authors.
