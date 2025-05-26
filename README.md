# Software architecture trade-offs & heuristics (SATH)   2025
 
## Informations complémentaires

Quelques notes sur ce que nous attendons de vous:

1.  Il est important que chaque membre du groupe participe de manière équitable avec ses pairs. Pour cela nous regarderons l'historique des commits, qui a fait quoi et leur répartition dans le temps. 

2.  Il est important que votre travail soit structuré et itératif, pour cela nous nous attendons a avoir un répertoire documentation contenant 3 types d'artefacts:
     - une documentation utilisateur : un quick start qui permette a quelqu'un d'installer, de lancer votre application et de commencer a l'utiliser rapidement. Cela doit décrire en plus les grands blocs fonctionnels décrivant ce que votre application peut faire et comment.
     - une documentation de contexte: toute solution a son lot de choix et compromis, pour cela nous voulons voir des ADR (Architecture Decision Records) qui expliquent les différentes options (architecture, stack, librairies et outils) qui s'offraient à vous (voir un template ou doc ou autre doc)
     - des diagrames d'architecture : des images valant mieux que des mots, il est important d'exprimer simplement et visuellement comment est faite votre application. Pour cela nous préconisons le modèle C4, en ayant au moins un diagrame de contexte (niveau 1) et un ou plusieurs diagrammes d'application (niveau 2, container). Si vous n'en avez jamais fait, inspirez vous simplement de cette démo, ou j'ai mis 3 niveaux.

3.  Developpability and deployability : afin de structurer votre application en espaces cloisonnés, de simplifier le développement local ou la déployabilité serveur, il est recommandé de mettre votre application, ainsi que ses services ou dépendances en containers. Nous nous attendons donc à voir à minima un Dockerfile et éventuellement un docker-compose.yaml pour vos dépendances. 

4. Vous devez utiliser la ou les stacks techniques avec lesquelles l'ensemble de l'équipe est le plus à l'aise et productive. Il n'y a pas de contraintes de language, veuillez cependant noter que si votre language n'a pas les subtilités d'abstraction nécessaires propres d'une architecture moderne, cela va être plus compliqué (interfaces/contrats, injection de dépendances, ...)

Afin de s'assurer que le travail est fait de manière incremental et que les différents artefacts attendus d'y trouvent il vous sera demandé de fournir pendant le cours à différents moments ces derniers : choix d'architecture, diagrames, "walking skeleton", pre-version 1, pre-version 2. Tous les artefacts étant à mettre dans le même repo git, il est demandé de placer un git tag "[rendu_1]", "[rendu_2]", etc... pour chacun lors de votre commit et partage.  

Si vous avez des questions, venez me voir!
Bon travail ;)