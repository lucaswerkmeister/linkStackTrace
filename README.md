linkStackTrace
==============

linkStackTrace will go through a Java stack trace, search for files in a Github repository and add Markdown links to the stack trace.

Given the following stack trace
```
java.lang.RuntimeException: 
    at com.redhat.ceylon.compiler.java.codegen.Assert.fail(Assert.java:37)
    at com.redhat.ceylon.compiler.java.codegen.Assert.fail(Assert.java:43)
    at com.redhat.ceylon.compiler.java.codegen.AnnotationInvocationVisitor.<init>(AnnotationInvocationVisitor.java:73)
    at com.redhat.ceylon.compiler.java.codegen.ExpressionTransformer.transformAnnotation(ExpressionTransformer.java:4354)
    at com.redhat.ceylon.compiler.java.codegen.ExpressionTransformer.transform(ExpressionTransformer.java:4319)
    at com.redhat.ceylon.compiler.java.codegen.CeylonTransformer.transformPackageDescriptor(CeylonTransformer.java:455)
```
and the repository `ceylon/ceylon-compiler`, it will

* extract the file+line infos (`Assert.java:37`, `Assert.java:43`, `AnnotationInvocationVisitor.java:73`, etc.)
* search for the files (`Assert.java`, `AnnotationInvocationVisitor.java`, etc.) on GitHub in the repository `ceylon/ceylon-compiler`
* and, if a unique match is found, replace the file:line in the stack trace with a Markdown link to the correct line of the found file

resulting in this Markdown:
```
java.lang.RuntimeException: 
    at com.redhat.ceylon.compiler.java.codegen.Assert.fail(Assert.java:37)
    at com.redhat.ceylon.compiler.java.codegen.Assert.fail(Assert.java:43)
    at com.redhat.ceylon.compiler.java.codegen.AnnotationInvocationVisitor.<init>([AnnotationInvocationVisitor.java:73](https://github.com/ceylon/ceylon-compiler/blob/5323225dbbe3d87b221e0b64cec0e68d8b09adab/src/com/redhat/ceylon/compiler/java/codegen/AnnotationInvocationVisitor.java#L73))
    at com.redhat.ceylon.compiler.java.codegen.ExpressionTransformer.transformAnnotation([ExpressionTransformer.java:4354](https://github.com/ceylon/ceylon-compiler/blob/a57480723c29636dec6ae2d7606b1afc05d6be8b/src/com/redhat/ceylon/compiler/java/codegen/ExpressionTransformer.java#L4354))
    at com.redhat.ceylon.compiler.java.codegen.ExpressionTransformer.transform([ExpressionTransformer.java:4319](https://github.com/ceylon/ceylon-compiler/blob/a57480723c29636dec6ae2d7606b1afc05d6be8b/src/com/redhat/ceylon/compiler/java/codegen/ExpressionTransformer.java#L4319))
    at com.redhat.ceylon.compiler.java.codegen.CeylonTransformer.transformPackageDescriptor([CeylonTransformer.java:455](https://github.com/ceylon/ceylon-compiler/blob/9b2ed03f6ec738925b7c2d00e8fbd2b55bf89e51/src/com/redhat/ceylon/compiler/java/codegen/CeylonTransformer.java#L455))
<sup>Generated by [linkStackTrace](http://lucaswerkmeister.github.io/linkStackTrace/)</sup>
```
which, rendered, looks like this¹:
> java.lang.RuntimeException: 
    at com.redhat.ceylon.compiler.java.codegen.Assert.fail(Assert.java:37)
    at com.redhat.ceylon.compiler.java.codegen.Assert.fail(Assert.java:43)
    at com.redhat.ceylon.compiler.java.codegen.AnnotationInvocationVisitor.<init>([AnnotationInvocationVisitor.java:73](https://github.com/ceylon/ceylon-compiler/blob/5323225dbbe3d87b221e0b64cec0e68d8b09adab/src/com/redhat/ceylon/compiler/java/codegen/AnnotationInvocationVisitor.java#L73))
    at com.redhat.ceylon.compiler.java.codegen.ExpressionTransformer.transformAnnotation([ExpressionTransformer.java:4354](https://github.com/ceylon/ceylon-compiler/blob/a57480723c29636dec6ae2d7606b1afc05d6be8b/src/com/redhat/ceylon/compiler/java/codegen/ExpressionTransformer.java#L4354))
    at com.redhat.ceylon.compiler.java.codegen.ExpressionTransformer.transform([ExpressionTransformer.java:4319](https://github.com/ceylon/ceylon-compiler/blob/a57480723c29636dec6ae2d7606b1afc05d6be8b/src/com/redhat/ceylon/compiler/java/codegen/ExpressionTransformer.java#L4319))
    at com.redhat.ceylon.compiler.java.codegen.CeylonTransformer.transformPackageDescriptor([CeylonTransformer.java:455](https://github.com/ceylon/ceylon-compiler/blob/9b2ed03f6ec738925b7c2d00e8fbd2b55bf89e51/src/com/redhat/ceylon/compiler/java/codegen/CeylonTransformer.java#L455))
<sup>Generated by [linkStackTrace](http://lucaswerkmeister.github.io/linkStackTrace/)</sup>

¹: If you use the linked stack trace in GitHub issues, GitHub Flavored Markdown is used, which keeps line breaks.

Search results are cached to minimize the amount of GitHub searches that are necessary;
if it still hits GitHub’s rate limit, you get a message when the rate limit will reset, and can also enter your own API token if you want to.

Legalese
--------
The content of this repository is released under the GNU AGPLv3 as provided in the LICENSE file that accompanied this code.

By submitting a "pull request" or otherwise contributing to this repository, you agree to license your contribution under the license mentioned above.
